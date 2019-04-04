"use strict";
const fs = require('fs');
const bittorrent = require('./class/bittorrent');

global.__basedir = __dirname;

let bt_cli = new bittorrent();

let torrent_folder = __basedir + '/torrents/';

fs.readdirSync(torrent_folder).forEach(file => {
		bt_cli.addTorrentFromFile(torrent_folder + file);
})

