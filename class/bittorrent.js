const fs = require('fs');
const ByteBuffer = require("bytebuffer");

const http = require('http');
const net = require('net');
const sha1 = require('sha1');

const bencode = require('../class/bencode');
const peer = require('../class/peer');
const EventEmitter = require('events');

class torrent extends EventEmitter
{
	constructor (bt_cli, obj)
	{
		super();
		this.bt_cli = bt_cli;
		this.peers = Object();
		this.nb_peers = 0;

		this.peers_connected = Array();
		this.build(obj);
		

		this.peer_id = "2b90241f8e95d53cacf0f8c72a92e46b57911600";
		this.protocol = "BitTorrent protocol";
	}

	start()
	{
		try
		{
			this.make_announce();
		}
		catch(e)
		{
			console.log(e);
		}
	}

	build(obj)
	{
		this.announce = obj.announce;
		this.info = Object();
		this.info.piece_length = obj.info["piece length"];
		this.info.pieces = obj.info["pieces"];
		this.info.name = obj.info["name"];
		this.info_hash = sha1(Buffer.from(bencode.encode(obj.info), 'binary'));
	
		if ("files" in obj.info)
		{
			// Foreach
			throw  "Multiples files torrent not supported yet: " + this.info.name;

			if ("md5sum" in obj.info)
				this.info.md5sum = obj.info["md5sum"];
			/* MULTIPLE FILE MODE
				this.files {}
					this.path	[path, path, path, filename]
					this.length
			 */
		}
		else
		{
			this.info.length = obj.info.length;

			this.nb_pieces = Math.ceil(this.info.length / this.info.piece_length);
			this.bitfield_length = Math.ceil(this.nb_pieces / 8);
			this.bitfield = Buffer.alloc(this.bitfield_length);
			this.bitfield = new Buffer.alloc(this.bitfield_length);
			if ("md5sum" in obj.info)
				this.info.md5sum = obj.info["md5sum"];
		}
		if ("private" in obj["info"])
			this.info.private = obj.info.private;
		if ("announce list" in obj)
			this.announce_list = obj["announce list"];
		if ("creation date" in obj)
			this.creation_date = obj["creation date"];
		if ("comment" in obj)
			this.comment = obj["comment"];
		if ("created by" in obj)
			this.created_by = obj["created by"];
		if ("encoding" in obj)
			this.encoding = obj["encoding"];
	}

	check_piece()
	{
		bitfield_set(this.bitfield[index]);
	}

	check_local()
	{
		// check all local resources
		// all sha1 pieces
		// build bitfield
	}

	bitfield_set(index)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);

		if (i >= this.bitfield.length)
			throw "bitfield_set bad offset";

		this.bitfield[i] |= bit;
		// broadcast to peer than I have now this piece
	}
	
	bitfield_read(bitfield, index)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);

		if (i >= bitfield.length)
			throw "bitfield_read bad offset";
		bitfield[i] |= bit

		return ;
	}


	download()
	{
		/*
		var promise = new Promise((resolve, reject) => {
				peer.ask_block(0);
				peer.onload = () => resolve(value);
				peer.onfail = () => reject(value);
			}
		);
		promise
			.then((peer) => {
				ask_next_part_to(peer);
			})
			.catch ((piece) => {
				ask_somebody(piece);
		});
		*/
	}

	add_peers(new_peers)
	{
		Object.assign(this.peers, new_peers);
		if (Object.keys(this.peers).length != this.nb_peers)
		{
			this.nb_peers = Object.keys(this.peers).length;
			this.connect_all_peers();
		}
	}

	connect_all_peers()
	{

		Object.keys(this.peers).forEach((key) => {
			let peer = this.peers[key];

			peer.connection(this);

			peer.on('ready', () => {
				console.log('READY');
				console.log(peer.ip);
				// look wich piece must be downloaded
				// peer.ask_block(piece, start = 0)
			});

		});

/*		this.peers.forEach(peer => {
			peer.connection(this.bt_cli, this);
			peer.on('ready', () => {
				console.log('READY');
				console.log(peer.ip);
				// look wich piece must be downloaded
				// peer.ask_block(piece, start = 0)
			});
		});
		*/
	}

	make_announce()
	{
		if (this.announce.search("udp") > -1)
		{
			console.log("UPD TRACKER NOT SUPORTED YET");
			return;
		}

		let url = this.announce
			+ "?" + "info_hash="	+ this.url_encode(this.info_hash)
			+ "&" + "peer_id="		+ this.url_encode(this.peer_id)
			+ "&" + "port="			+ 6881
			+ "&" + "uploaded="		+ 0
			+ "&" + "downloaded="	+ 0
			+ "&" + "left="			+ 0
			+ "&" + "event="		+ "started"
			+ "&" + "numwant="		+ 50
			+ "&" + "compact="		+ 1;

		http.get(url, (resp) => {
			let data = '';
			resp.setEncoding('binary')
				.on('data', (chunk) => { data += chunk; })
				.on('end', () => {

					let response = new bencode(Buffer.from(data, 'binary'));

					if (response.data['failure reason'])
					{
						console.log(response.data);
						return;
					}

					let str_peers = response.data.peers;
					if (typeof str_peers === "undefined")
					{
						console.log("no list peers given");
						return;
					}

					try
					{
						this.add_peers(this.get_ip(str_peers))
					}
					catch (e)
					{
						console.log(e);
					}

				});
		})
		.on("error", (err) => {
			console.log("Error: " + err.message);
		});
	}

	url_encode(url)
	{
		var i = 0;
		var str = "";

		while (i < url.length)
		{
			var decimalValue = parseInt(url[i] + "" + url[i + 1], 16);
			var character = String.fromCharCode(decimalValue);
			if ((decimalValue >= 47 && decimalValue <= 57)
				|| (decimalValue >= 65 && decimalValue <= 90)
				|| (decimalValue >= 97 && decimalValue <= 122))
				str += character;
			else
				str += '%' + url[i] + url[i + 1];
			i += 2;
		}
		return (str);
	}

	get_ip(peers)
	{
		let seeders = Object();
		var i = 0;

		if ((peers.length % 6) != 0)
			throw "peers not parseable";
		while (i < peers.length)
		{
			let ip = peers[i].charCodeAt(0) +
				"." + peers[i + 1].charCodeAt(0)+
				"." + peers[i + 2].charCodeAt(0)+
				"." + peers[i + 3].charCodeAt(0);
			var buf = Buffer.from(peers.slice(i + 4, i + 6), 'binary');
			var port = buf[0] * 256 + buf[1];

			let id = peers.slice(i, i + 6);
			seeders[id] = new peer( id, ip, port, this.protocol, this.peer_id);
			i += 6;
		}
		return (seeders);
	}

}

class bittorrent
{
	constructor()
	{
		this.torrents = Object();
	}

	addTorrentFromFile(file)
	{
		let buffer = fs.readFileSync(file);
		try
		{
			var new_torrent = new torrent(this, new bencode(buffer).data);
			if ('key' in this.torrents)
				throw "Torrent " + new_torrent.info.name + " already existe info_hash=[" + new_torrent.info_hash + "]";
			else
			{
				this.torrents[new_torrent.info_hash] = new_torrent;
				new_torrent.start();
			}
		}
		catch (e)
		{
			throw 'Add torrent file : ' + e;
			console.log(e);
		}


	}
}

module.exports = bittorrent;
