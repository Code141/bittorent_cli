const router = require('express').Router();
const fs = require('fs');
const bittorrent = require('../class/bittorrent');

const torrent_folder = __basedir + '/torrents/';

module.exports = router;

const bt_cli = new bittorrent();

router
	.get('/', (req, res) => {

		fs.readdirSync(torrent_folder).forEach(file => {
				bt_cli.addTorrentFromFile(torrent_folder + file);
		})
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

