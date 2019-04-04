"use strict";
const EventEmitter = require('events');
const fs = require('fs');

const http = require('http');
const net = require('net');
const sha1 = require('sha1');
const path = require('path');

const bencode = require('../class/bencode');
const torrent = require('../class/torrent');
const peer = require('../class/peer');

const download_folder = "/tmp/download/";

class bittorrent
{
	constructor()
	{
		this.torrents = Object();
		this.peer_id = "2b90241f8e95d53cacf0f8c72a92e46b57911600";
		this.protocol = "BitTorrent protocol";

		if (!fs.existsSync(download_folder))
			fs.mkdir(download_folder, { recursive: true }, (err) => {
				if (err) throw err;
			});
	}

	make_announce(torrent)
	{
		return new Promise((resolve, reject) => {

			if (torrent.announce.search("udp") > -1)
				reject ("UPD TRACKER NOT SUPORTED YET");

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
							torrent.add_peers(this.get_ip(str_peers))
						}
						catch (e)
						{
							console.log(e);
						}
						resolve();
					});
			})
				.on("error", (err) => {
					console.log("Error: " + err.message);
				});
		})
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

	addTorrentFromFile(file)
	{
		let buffer = fs.readFileSync(file);

		let data = new bencode(buffer).data;
		let new_torrent = new torrent(this);

		new_torrent.build_from_torrent_file(data).then(() => {
			this.make_announce(new_torrent).then(() => {

				if (data.info_hash in this.torrents)
					throw "Torrent " + new_torrent.info.name + " already existe info_hash=[" + new_torrent.info_hash + "]";
				else
				{
					this.torrents[new_torrent.info_hash] = new_torrent;
					console.log("Start with " + new_torrent.nb_peers + " peers.");
					new_torrent.start();
				}

			}).catch((reason) => {
				console.log("Announce fail: " + reason);
			});

		}).catch((reason) => {
			console.log("Build fail: " + reason);
		});

	}
}

module.exports = bittorrent;
