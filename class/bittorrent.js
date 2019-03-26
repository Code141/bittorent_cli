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
	constructor (obj)
	{
		super();
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
			this.bitefield = Buffer.alloc(this.bitfield_length);
			this.bitefield = new Buffer.alloc(this.bitfield_length);
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

		this.peers = Array();
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

	map_bitfield()
	{
		this.peers.forEach(peer => {
			console.log(peer.bitefield);
			console.log(peer.ip);
		});
	}

}

class bittorrent
{
	constructor()
	{
		this.protocol = "BitTorrent protocol";
		this.torrents = Object();
		this.peer_id = "2b90241f8e95d53cacf0f8c72a92e46b57911600";
	}

	addTorrentFromFile(file)
	{
		let buffer = fs.readFileSync(file);

		var t = new torrent(new bencode(buffer).data);
		for (var info_hash in this.torrents)
			if (t.info_hash === info_hash)
				throw "Torrent " + t.info.name + " already existe info_hash=[" + t.info_hash + "]";
		this.torrents[t.info_hash] = t;

		this.announce(t);
	}

	announce(torrent)
	{
		if (torrent.announce.search("udp") > -1)
		{
			console.log("UPD TRACKER NOT SUPORTED YET");
			return;
		}

		let url = torrent.announce
			+ "?" + "info_hash="	+ this.url_encode(torrent.info_hash)
			+ "&" + "peer_id="		+ this.url_encode(this.peer_id)
			+ "&" + "port="			+ 6881
			+ "&" + "uploaded="		+ 0
			+ "&" + "downloaded="	+ 0
			+ "&" + "left="			+ 0
			+ "&" + "event="		+ "started"
			+ "&" + "numwant="		+ 50
			+ "&" + "compact="		+ 1;

		http
			.get(url, (resp) => {
				let data = '';
				resp
					.setEncoding('binary')
					.on('data', (chunk) => { data += chunk; })
					.on('end', () => {

						let response = new bencode(Buffer.from(data, 'binary'));

						if (response.data['failure reason'])
						{
							console.log(response.data);
							return;
						}

						let peers = response.data.peers;

						if (typeof peers === "undefined")
						{
							console.log("no list peers given");
							return;
						}
						// If typeof peer === string
						try
						{
							this.get_ip(peers).forEach(peer => {
								// If is not present in torrent.peers
								torrent.peers.push(peer);
								peer.connection(this, torrent);
								peer.on('ready', () => {
									console.log('READY');
								});
							});
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
		let seeders = Array();
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
			seeders.push(new peer(ip, port));
			i += 6;
		}
		return (seeders);
	}
}

module.exports = bittorrent;
