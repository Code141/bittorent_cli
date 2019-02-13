const http = require('http');
const bencode = require('../class/bencode');

url = 'http://torrent.ubuntu.com:6969/announce?info_hash=zzefeuyfjkhgjr';


class bittorrent
{
	constructor(torrent)
	{

		var info_hash = this.url_encode(torrent.get_info_hash())
		var peer_id = this.url_encode(torrent.get_info_hash())

		url = torrent.data.announce
			+ "?" + "info_hash="	+ info_hash
			+ "&" + "peer_id="		+ peer_id
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
				console.log("------------------------------------------------------------");

				buffer = Buffer.from(data, 'binary')
				let response = new bencode(buffer);

				torrent.response = response;

				console.log(response);

				console.log("--------------------");
				console.log("GET IP");
				torrent.get_ip();
				console.log("--------------------");

			});

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
			var decimalValue = parseInt(url[i] + "" + url[i+1], 16);
			var character = String.fromCharCode(decimalValue);
			if ((decimalValue >= 47 && decimalValue <= 57)
				|| (decimalValue >= 65 && decimalValue <= 90)
				|| (decimalValue >= 97 && decimalValue <= 122))
				str += character;
			else
				str += '%' + url[i] + url[i+1];
			i += 2;
		}
		return (str);
	}
}

module.exports = bittorrent;
