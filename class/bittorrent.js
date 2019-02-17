const http = require('http');
const bencode = require('../class/bencode');
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

		http.get(url, (resp) => {
			resp.setEncoding('binary');

			let data = '';

			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () => {
				buffer = Buffer.from(data, 'binary')

				try {
					let response = new bencode(buffer);
					torrent.response = response;
					if (response.data['failure reason'])
					{
						console.log(response.data);
						return;
					}
					if (typeof this.response.data.peers === "undefined")
					{
						console.log("no peers in tracker response");
						return
					}
					torrent.get_ip();

					torrent.seeders.forEach(peer => {
						this.peer(peer.ip, peer.port);
					});
				}
				catch (e)
				{
					console.log("Bittorrent: " + e);
				}
			});
		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
	}

	peer(ip, port)
	{
		console.log('trying ' + ip + ':' + port);
		var client = new net.Socket();
		client.setEncoding('binary');

		client.connect(port, ip, () => {
			console.log('Connected at ' + ip + ':' + port);

			var info_hash_buffer = ByteBuffer.fromHex(torrent.info_hash).buffer;
			var peer_id_buffer = ByteBuffer.fromHex(this.peer_id).buffer;
			let buf = Buffer.alloc(1 + 19 + 8 + 20 + 20, 0, 'binary');
			buf[0] = 19;

			buf.write("BitTorrent protocol", 1, 'binary');
			info_hash_buffer.copy(buf, 28);
			peer_id_buffer.copy(buf, 48);
			client.write(buf, 'binary');
		});

		client.on('data', function(data) {
			console.log('Received: ' + data);
			client.destroy(); // kill client after server's response
		});

		client.on('close', function() {
			console.log('Connection closed ' + ip + ':' + port);
		});

		client.on('error', (err) => {
			console.log(err);
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
