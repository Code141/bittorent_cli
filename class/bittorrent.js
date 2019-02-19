const http = require('http');
const bencode = require('../class/bencode');
const peer = require('../class/peer');
const net = require('net');
const ByteBuffer = require("bytebuffer");

class bittorrent
{
	constructor(torrent)
	{
		torrent.info_hash = torrent.get_info_hash();
		this.peer_id = torrent.info_hash;
		console.log("BitTorrent protocol" + torrent.info_hash);
		this.announce();
	}

	announce()
	{
		let url = torrent.data.announce
			+ "?" + "info_hash="	+ this.url_encode(torrent.info_hash)
			+ "&" + "peer_id="		+ this.url_encode(this.peer_id)
			+ "&" + "port="			+ 6881
			+ "&" + "uploaded="		+ 0
			+ "&" + "downloaded="	+ 0
			+ "&" + "left="			+ torrent.data.info.length
			+ "&" + "event="		+ "started"
			+ "&" + "numwant="		+ 50
			+ "&" + "compact="		+ 1;
console.log(torrent.data.info);
		http.get(url, (resp) => {
			let data = '';

			resp.setEncoding('binary');

			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () => {
				buffer = Buffer.from(data, 'binary')
//				try {
					let response = new bencode(buffer);
					torrent.response = response;
					if (response.data['failure reason'])
					{
						console.log(response.data);
						return;
					}
					torrent.get_ip();
					this.peers = Array();
					torrent.seeders.forEach(p => {
						this.peers.push(new peer(torrent.info_hash, this.peer_id, p));
					});
/*				}
				catch (e)
				{
					console.log("Bittorrent: " + e);
				}
*/			});
		}).on("error", (err) => {
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
}

module.exports = bittorrent;
