const router = require('express').Router();
const fs = require('fs');
const bittorrent = require('../class/bittorrent');

const torrent_folder = __basedir + '/torrents/';

module.exports = router;

const bt_cli = new bittorrent();

router
	.get('/', (req, res) => {

		fs.readdirSync(torrent_folder).forEach(file => {
			try {
				bt_cli.addTorrentFromFile(torrent_folder + file);
			} catch (e) {
				console.log("Add torrent file : " + e);
			}
		})

		try {
			bt_cli.addTorrentFromFile(torrent_folder + "tmw-wave.torrent");
		} catch (e) {
			console.log("Add torrent file : " + e);
		}

		res.send({status: true});
	})


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

