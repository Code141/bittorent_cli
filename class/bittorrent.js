const EventEmitter = require('events');
const fs = require('fs');

const http = require('http');
const net = require('net');
const sha1 = require('sha1');
const path = require('path');

const bencode = require('../class/bencode');
const peer = require('../class/peer');

const download_folder = "./download/";

class torrent extends EventEmitter
{
	constructor (bt_cli, obj)
	{
		super();
		this.bt_cli = bt_cli;
		this.peers = Object();
		this.nb_peers = 0;

		this.peers_connected = Array();
		this.peers_working = Array();
		this.peers_idle = Array();


		this.peer_id = "2b90241f8e95d53cacf0f8c72a92e46b57911600";
		this.protocol = "BitTorrent protocol";
		this.piece = Array();




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
			this.bitfield_working = Buffer.alloc(this.bitfield_length);


			if ("md5sum" in obj.info)
				this.info.md5sum = obj.info["md5sum"];
			fs.open(download_folder + this.info.name, "a+", 0o666, (err, fd) => {
				if (err)
				{
				//	throw err;
					console.log(err);
					return;
				}
				this.file = fd; 
				this.emit('ready');					// WARNING ASYNCHRONOUS VULN
			})
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

	start()
	{
		this.make_announce();
	}

/*-- ANNOUNCER ------------------------------------------------------------------------------------*/

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

/*-- FILE MANAGER ---------------------------------------------------------------------------------*/

	bitfield_set(index)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);
		
		if (i >= this.bitfield.length)
			throw "bitfield_set bad offset";

		this.bitfield[i] |= bit;			// ATTENTION A NE PAS ADDITIONER ET DECALER LES BITS
	}
	
	bitfield_read(bitfield, index)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);

		if (i >= bitfield.length)
			throw "bitfield_read bad offset";
		return (bitfield[i] & bit);
	}

	check_piece(index, piece)
	{
		let hash = Buffer.from(this.info.pieces.slice(index * 20, index * 20 + 20), "binary");
		let sha1_new_piece = sha1(piece);
		let i = 0;
		let hash2 = Buffer.alloc(20);
		while (i < 20)
		{
			hash2[i] = parseInt(sha1_new_piece.substring(i * 2, i * 2 + 2), 16);
			i++;
		}
		if (Buffer.compare(hash, hash2))
			return false;
		return true;
	}

	check_local()
	{
		// check all local resources
		// all sha1 pieces
		// build bitfield
	}

/*-- PEERS CONTROLER ------------------------------------------------------------------------------*/

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
				// look wich piece must be downloaded
				// peer.ask_block(piece, start = 0)
			});
			peer.on('piece_finished', (index, piece) => {
				if (this.check_piece(index, piece))
				{
					fs.write(this.file, piece, 0, piece.length, (index * this.info.piece_length), (err, bytesWritten, buffer) => {
						if (err) throw err; // AND RETRY
						this.bitfield_set(index);
						// broadcast to peer than I have now this piece
						peer.ask_block(index + 1, piece);
					})
				}
			});
		});
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

				new_torrent.on('ready', () => {
					new_torrent.start();
				});
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
