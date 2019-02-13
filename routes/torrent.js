const router = require('express').Router();
const bencode = require('../class/bencode');
const bittorrent = require('../class/bittorrent');
const fs = require('fs');

const torrent_folder = __basedir + '/torrents/';

module.exports = router;

router
	.get('/', (req, res) => {

		var torrents = Array();

		fs.readdirSync(torrent_folder).forEach(file => {
			buffer = fs.readFileSync(torrent_folder + file);

/*
			promise = new Promise(function (resolve, reject) {
				if (true)
					resolve("true");
				else
					reject("false");
			});

			promise
				.then(value => { console.log("resolve : " + value); })
				.catch(value => { console.log("reject : " + value); });
*/


			torrent = new bencode(buffer);
			if (torrent.data.announce.search("http") != -1)
				buf = new bittorrent(torrent);
			torrents.push(torrent.data);
		})
		/*
		buffer = fs.readFileSync(torrent_folder + "test");
		torrent = new bencode(buffer);
		buf = new bittorrent(torrent);
		torrents.push(torrent.data);
		 */
		res.send({status: true, torrents: torrents});

	})

