const EventEmitter = require('events');
const sha1 = require('sha1');
const fs = require('fs');
const path = require('path');

const bencode = require('../class/bencode');

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

class file extends EventEmitter
{
	constructor (file_path, length, offset = 0)
	{
		super();

		this.basename = path.basename(path.join(file_path));
		this.dirname = path.dirname(path.join(download_folder + path.join(file_path)));

		this.path = path.join(this.dirname, this.basename);

		this.length = length;
		this.offset = offset;


		if (!fs.existsSync(this.dirname))
			fs.mkdirSync(path.dirname(file_name), { recursive: true });
		fs.writeFileSync(this.path, "", {flag: "a+", mode: 0o666});
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

		if ("files" in obj.info)
		{
			let offset = 0
			// Foreach

			console.log(obj.info.files);
			for (file in this.obj.files)
			{
				offset += file.lenght;
				this.files.push = new file(file.path, obj.info.lenght, offset);
				//if ("md5sum" in obj.info)
				//	this.file.md5sum = obj.info["md5sum"];
			}
		}
		else
		{
			this.files.push = new file(this.info.name, obj.info.length);

			this.info.length = obj.info.length;

			this.nb_pieces = Math.ceil(this.info.length / this.info.piece_length);
			this.bitfield_length = Math.ceil(this.nb_pieces / 8);

			this.bitfield = Buffer.alloc(this.bitfield_length);
			this.bitfield_working = Buffer.alloc(this.bitfield_length);

			if ("md5sum" in obj.info)
				this.info.md5sum = obj.info["md5sum"];

			this.check_local_files()
				.then(() => {
					resolve();
				})
				.catch(() => {
				});
		}
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
		console.log(this.nb_peers);
		this.connect_all_peers();
	}

	/*-- FILE MANAGER ---------------------------------------------------------------------------------*/

	bitfield_set(bitfield, index)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);
		if (i >= bitfield.length)
			throw "bitfield_set bad offset";
		if (!(bitfield[i] & bit))
			bitfield[i] |= bit;
	}

	bitfield_unset(bitfield, index)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);
		if (i >= bitfield.length)
			throw "bitfield_set bad offset";
		bitfield[i] &= ~(bit);
	}

	bitfield_read(bitfield, index)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);
		if (i >= bitfield.length)
			throw "bitfield_read bad offset";
		return (bitfield[i] & bit);
	}

	check_piece(index, piece)
	{
		let sha1_new_piece = sha1(piece);

		let hash_1 = Buffer.from(this.info.pieces.slice(index * 20, index * 20 + 20), "binary");
		let hash_2 = Buffer.alloc(20);

		for (let i = 0; i < 20; i++)
			hash_2[i] = parseInt(sha1_new_piece.substring(i * 2, i * 2 + 2), 16);

		console.log("");
		console.log("Piece [" + index + " / " + this.nb_pieces + "]");
		console.log(hash_1);
		console.log(hash_2);

		if (Buffer.compare(hash_1, hash_2))
			return false;
		else
			return true;
	}

	check_local_files()
	{
		return new Promise((resolve, reject) => {
			let index = 0;
			var buffer = Buffer.alloc(0);

			// PUT WHILE HERE
			let readableStream = fs.createReadStream(download_folder + this.info.name, {
				flags: 'r+'
			});

			readableStream
				.on('data', (chunk) => {

					buffer = Buffer.concat([buffer, chunk]);
					let current_piece_length = this.info.piece_length;

					while (buffer.length >= current_piece_length)
					{
						let piece = Buffer.from( buffer, 0, current_piece_length);
						if (this.check_piece(index, piece))
							this.bitfield_set(this.bitfield, index);
						buffer = buffer.slice(current_piece_length);
						print_buff_bin(this.bitfield, 0, Math.ceil(index/8));
						index++;
					}
				})
				.on('end', () => {
					console.log('---------------------------------- FILE LOADED ----------------------------------');
					// JUMP ON NEXT FILE
					readableStream.destroy();
				})
				.on("close", () =>{
					console.log('                       ----------- FILE CLOSED ----------                        ');
					resolve();		// warning to resolve after multiples files
				});
		});

	}

	next_piece(index = 0)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);

		while (i < this.bitfield.length
			&& ((this.bitfield[i] === 0xff)
				|| ((this.bitfield[i] | this.bitfield_working[i]) === 0xff)))
			i++;
		if (i < this.bitfield.length)
		{
			let sector = this.bitfield[i] | this.bitfield_working[i];
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

	next_piece_hard(index = 0)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);

		while (i < this.bitfield.length && this.bitfield[i] === 0xff)
			i++;

		if (i < this.bitfield.length)
		{
			let sector = this.bitfield[i];
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


	/*-- PEERS CONTROLER ------------------------------------------------------------------------------*/

	give_job(peer)
	{
		let index = this.next_piece(0);
		if (index == -1)
			return console.log ("BORING !");

		while (!this.bitfield_read(peer.bitfield, index))
		{
			index = this.next_piece(index + 1);
			if (index == -1)
			{

				peer.ask_block(this.next_piece_hard(0));

				return console.log ("BORING !");
			}
		}
		this.bitfield_set(this.bitfield_working, index);
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
				this.bitfield_unset(this.bitfield_working, index);

				if (this.check_piece(index, piece))
				{

					var writeStream = fs.createWriteStream(download_folder + this.info.name, {
						flags: 'r+',
						mode: 0o666,
						start: this.info.piece_length * index,
					});

					writeStream.write(piece, () => {
						this.bitfield_set(this.bitfield, index);
						this.for_all_peers((peer) => {
							peer.send_have(index);
						})
					});

				}
				else
				{
					//				console.log('--- ' + index + ' -- FAILED----')
					// RETRY
				}

				console.log('');
				console.log('');
				console.log('');
				print_buff_bin(this.bitfield, 0, this.bitfield_working.length);
				console.log('');
				print_buff_bin(this.bitfield_working, 0,this.bitfield_working.length);
				console.log('----------------------------------------------------------------------');
				console.log('peers = ' + Object.keys(this.peers).length);
			});
		});
	}
}

module.exports = torrent;
