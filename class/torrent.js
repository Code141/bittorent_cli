
"use strict";
const EventEmitter = require('events');
const sha1 = require('sha1');
const fs = require('fs');
const path = require('path');

const bencode = require('../class/bencode');
const bitfield = require('../class/bitfield');

const download_folder = "/tmp/download/";

function	print_buff_bin(buf, start, offset)
{
	let i = 0;
	let str = "";
	while (i < offset)
	{
		let b = 0;
		while (b < 8)
		{
			let nb =  buf[start + i];
			str += (nb >> (7 - b)) & 0x01;
			b++;
		}
		str += " ";
		i++;
	}
	console.log(str);
}

class locale_file
{
	constructor (file_path, length, offset = 0)
	{
		this.must_be_downloaded = true;
		this.length = length;
		this.offset = offset;
		this.path = Array.isArray(file_path) ? file_path.join('/') : file_path;
		this.basename = path.basename(this.path);
		this.dirname = path.dirname(this.path);
		this.absolute_path = path.join(download_folder, this.dirname, this.basename);
//		if (!fs.existsSync(this.dirname))		NODE V10
//			fs.mkdirSync(this.dirname, { recursive: true, mode: 0o777 });
		this.mkdir_recursive();				//	NODE V8
		fs.writeFileSync(this.absolute_path, "", {flag: "a+", mode: 0o666});
	}

	mkdir_recursive()
	{
		let recur_path = '';
		this.dirname.split(path.sep).forEach((e) => {
			recur_path = path.join(recur_path, e);
			if (!fs.existsSync(download_folder + recur_path))
				fs.mkdirSync(download_folder + recur_path);
		});
	}

	write(index)
	{

	}
}

class torrent extends EventEmitter
{
	constructor (bt_cli)
	{
		super();
		this.bt_cli = bt_cli;
		this.peer_id = this.bt_cli.peer_id;
		this.protocol = this.bt_cli.protocol;

		this.peers = Object();
		this.nb_peers = 0;

		this.peers_connected = Array();
		this.peers_working = Array();
		this.peers_boring = Array();
		this.files = Array();
	}

	build_from_torrent_file(obj)
	{
		return new Promise((resolve, reject) => {
		console.log("Building " + obj.info["name"]);

		this.announce = obj.announce;
		this.info = Object();
		this.info.piece_length = obj.info["piece length"];
		this.info.pieces = obj.info["pieces"];
		this.info.name = obj.info["name"];
		this.info_hash = sha1(Buffer.from(bencode.encode(obj.info), 'binary'));


		// optionals
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
		// optionals

		let offset = 0

		if ("files" in obj.info)
		{
			Object.keys(obj.info.files).forEach((key) => {
				let file = obj.info.files[key];

				this.files.push(new locale_file(path.join(this.info.name, file.path.join('/')), file.length, offset));
				offset += file.length;

				//	if ("md5sum" in obj.info)
				//		this.file.md5sum = obj.info["md5sum"];

			});

			this.nb_pieces = Math.ceil(offset / this.info.piece_length);

			this.bitfield = new bitfield(Math.ceil(this.nb_pieces / 8));
			this.bitfield_working = new bitfield(Math.ceil(this.nb_pieces / 8));
		}
		else
		{

			this.files.push(new locale_file(this.info.name, obj.info.length));

			this.info.length = obj.info.length;

			this.nb_pieces = Math.ceil(this.info.length / this.info.piece_length);
			this.bitfield = new bitfield(Math.ceil(this.nb_pieces / 8));
			this.bitfield_working = new bitfield(Math.ceil(this.nb_pieces / 8));

			if ("md5sum" in obj.info)
				this.info.md5sum = obj.info["md5sum"];
		}

		this.check_local_files()
			.then(() => {
				resolve();
			})
			.catch(() => {
			});
		});
	}

	start()
	{
		/*
		let interval = 1800;
		const toto = setInterval(() => {
			this.make_announce();
		}, interval);
		 */
		console.log("Starting " + this.info.name);
		this.connect_all_peers();
	}

	/*-- FILE MANAGER -------------------------------------------------------*/

	check_piece(index, piece)
	{
		let sha1_new_piece = sha1(piece);

		let hash_1 = Buffer.from(this.info.pieces.slice(index * 20, index * 20 + 20), "binary");
		let hash_2 = Buffer.alloc(20);

		for (let i = 0; i < 20; i++)
			hash_2[i] = parseInt(sha1_new_piece.substring(i * 2, i * 2 + 2), 16);
		/*
			console.log("");
			console.log("Piece [" + index + " / " + this.nb_pieces + "]");
			console.log(hash_1);
			console.log(hash_2);
		*/
		if (Buffer.compare(hash_1, hash_2))
			return false;
		else
			return true;
	}

	async read (file) {
//		let readableStream = fs.createReadStream(file.absolute_path, { flags: 'r+' });

		return 
	}

	check_local_files()
	{
		return new Promise(async (resolve, reject) => {
			let index = 0;
			let percent = 0;
			let valide = 0;
			let invalid = 0;

			var buffer = Buffer.alloc(0);

			for (let file of this.files) {
				console.log('Checking ' + file.absolute_path)
				await new Promise(async (resolve) => {
					const stream = fs.createReadStream(file.absolute_path, {});
					stream.on('data', data => {
/*
var hash = crypto.createHash('md5'),
stream = fs.createReadStream('mybigfile.dat')
stream.on('data', function(data) {
  hash.update(data, 'utf8')
})
stream.on('end', function() {
  hash.digest('hex') // 34f7a3113803f8ed3b8fd7ce5656ebec
})
						*/
						/*
						buffer = Buffer.concat([buffer, data]);
						let current_piece_length = this.info.piece_length;
						while (buffer.length >= current_piece_length)
						{
							if (this.check_piece(index, buffer.slice(0, current_piece_length)))
							{
								valide++;
								this.bitfield.set(index);
							}
							buffer = buffer.slice(current_piece_length);
							percent =  Math.floor(index / this.nb_pieces * 100);
							console.log('');
							console.log('');
							console.log(this.info.name);
							console.log("Checking " + percent + "% " + this.info.name);
							print_buff_bin(this.bitfield.buffer, 0, this.bitfield_working.length);
							index++;
						}
						*/
					});
					stream.on('end', () => {
						stream.destroy();
					});
					stream.on('close', () => {
						resolve();
					});
				});

			}
		});
	}

	next_piece(index = 0)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);

		while (i < this.bitfield.length
			&& ((this.bitfield.buffer[i] === 0xff)
				|| ((this.bitfield.buffer[i] | this.bitfield_working.buffer[i]) === 0xff)))
			i++;
		if (i < this.bitfield.length)
		{
			let sector = this.bitfield.buffer[i] | this.bitfield_working.buffer[i];
			let j = index % 8;
			while ((sector & bit))
			{
				bit = bit >> 1;
				j++;
			}
			if (bit)
				return i * 8 + j;
		}
		return (-1);
	}

	/*-- PEERS CONTROLER ----------------------------------------------------*/

	give_job(peer)
	{
		let index = this.next_piece(0);
		if (index == -1)
			return console.log ("Finished (boring)" + peer.ip);

		while (!peer.bitfield.read(index))
		{
			index = this.next_piece(index + 1);
			if (index == -1)
			{
				index = this.bitfield.next();
				if (index != -1)
				{
					this.bitfield_working.set(index);
					peer.ask_block(index);
				}
				return console.log ("BORING !" + peer.ip + " 1");
			}
		}
		this.bitfield_working.set(index);

		if (index >= 0)
			peer.ask_block(index);
		else
			console.log("this peer don't have intereting piece now");
	}

	for_all_peers(cb)
	{
		Object.keys(this.peers).forEach((key) => {
			cb(this.peers[key]);
		});
	}


	add_peers(new_peers)
	{
		Object.assign(this.peers, new_peers);
		if (Object.keys(this.peers).length != this.nb_peers)
		{
			this.nb_peers = Object.keys(this.peers).length;
		}
	}

	connect_all_peers()
	{

		this.for_all_peers((peer) => {
			peer.connection(this);
			peer.on('ready', () => {
				this.give_job(peer);
			});

			peer.on('piece_finished', (index, piece) => {

				this.give_job(peer);
				this.bitfield_working.unset(index);

				if (this.check_piece(index, piece))
				{
				console.log('');
				console.log('');
				console.log(this.info.name);
				console.log('peers = ' + Object.keys(this.peers).length);
				console.log('piece finished ' + index + ' ' + this.info.name);
				print_buff_bin(this.bitfield.buffer, 0, this.bitfield_working.length);
				console.log('');
				print_buff_bin(this.bitfield_working.buffer, 0,this.bitfield_working.length);

					let piece_start = this.info.piece_length * index;
					for (let i = 0; i < this.files.length; i++)
					{
						let file = this.files[i];
						if (piece_start >= file.offset)
						{
							var writeStream = fs.createWriteStream(file.absolute_path, {
								flags: 'r+',
								mode: 0o666,
								start: this.info.piece_length * index - file.offset,
							});

							writeStream.write(piece, () => {
								this.bitfield.set(index);
								this.for_all_peers((peer) => {
									peer.send_have(index);
								})
							});
						}
					}

				}
				else
				{
					//				console.log('--- ' + index + ' -- FAILED----')
					// RETRY
				}

			
			});
		});
	}
}

module.exports = torrent;
