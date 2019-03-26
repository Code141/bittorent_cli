const net = require('net');
const ByteBuffer = require("bytebuffer");
const sha1 = require('sha1');
const EventEmitter = require('events');
/*
	print_buff_bin(buf, start, offset)
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
*/

class peer extends EventEmitter
{
	constructor(ip, port)
	{
		super();
		this.ip = ip;
		this.port = port;

		this.handshacked = false;

		this.am_choked = true;
		this.am_interested = false;
		this.peer_choked = true;
		this.peer_interested = false;
	}

	connection(bt_cli, torrent)
	{
		this.bt_cli = bt_cli;
		this.torrent = torrent;

		this.info_hash = ByteBuffer.fromHex(torrent.info_hash).buffer;
		this.peer_id = ByteBuffer.fromHex(bt_cli.peer_id).buffer;

		this.buffer = Buffer.alloc(0);
		this.bitefield = Buffer.alloc(0);

		this.piece_buffer = Buffer.alloc(torrent.info.piece_length);

		this.client = new net.Socket();
		this.client
			.setEncoding('binary')
			.on('connect', () => {
				this.send_handshake();
			})
			.on('data', (data) => {
				this.read(data);
			})
			.on('close', () => {
				console.log('Connection closed ' + this.ip + ':' + this.port);
			})
			.on('error', (err) => {
				console.log(err.Error);
			})
			.connect(this.port, this.ip);
	}

	read(data)
	{
		this.buffer = Buffer.concat([this.buffer, new Buffer.from(data, 'binary')]);

		if (!this.handshacked)
			this.get_handshake();

		if (this.handshacked)
			this.message();
	}

	message()
	{
		if (this.buffer.length < 4)
			return;

		let length = this.buffer.readUInt32BE(0);

		if (length == 0)
		{
			console.log("Keep alive");
			this.buffer = this.buffer.slice(4);
			return ;
		}

		length += 4;

		if (length > this.buffer.length)
			return;

		let id = this.buffer.readUInt8(4);
		let payload = this.buffer.slice(5, length);

		if (id == 0)							// Choke
			this.am_choked = true;
		else if (id == 1)						// Unchoke
		{
			this.am_choked = false;
			// ASK TO CLI WICH PART CAN BE DOWNLOADED
			this.ask_block(0);
		}
		else if (id == 2)						// Interested
			this.peer_interested = true;
		else if (id == 3)						// Not interested
			this.peer_interested = false;
		else if (id == 4)						// Have
			this.get_have(payload);
		else if (id == 5)						// Bitfield
			this.get_bitfield(payload);
		else if (id == 6)						// Request
			console.log("Request");
		else if (id == 7)						// Piece
			this.get_block(payload);
		else if (id == 8)						// Cancel
			console.log("Cancel");
		else if (id == 9)
			console.log("Port");
		else
			console.log("ID message extention from peer error");

		this.buffer = this.buffer.slice(length);
		this.message();
	}

	get_bitfield(payload)
	{
		if (payload.length != this.torrent.bitfield_length)
		{
			this.client.destroy();
			// REMOVE SELF FROM this.torrent.peer
			console.log("Bad bitefield size from " + this.ip + "; Expected: " + this.torrent.bitfield_length + ", got: " + length);
		}
		this.bitefield = payload;
	}

	get_have(payload)
	{
			let payload_int = payload.readUInt32BE(0);
			let index = Math.floor(payload_int / 8);
			let bit = 0x80 >> (payload_int % 8);

			// CHECK INDEX OVERFLOW
			this.bitefield[index] |= bit;
	}

	get_block(payload)
	{

		// VERIFIER QUE LA PIECE EST BIEN CELLE DEMANDER
		// SINON POSSIBILITEE D'INJECTION
		// OU DE DEPASSEMENT

		let index = payload.readUInt32BE(0);
		let begin = payload.readUInt32BE(4);
		let block = payload.slice(8, payload.length);

		block.copy(this.piece_buffer, begin);

		if (begin + block.length < this.torrent.info.piece_length)
			this.ask_block(0, begin + block.length);
		else
		{
			let hash = Buffer.from(this.torrent.info.pieces.slice(0, 20), "binary");

			console.log("----------------");
			console.log(hash);
			console.log(sha1(this.piece_buffer));
			console.log("----------------");

			this.torrent.piece[index] = this.piece_buffer;

			let i = Math.floor(index / 8);
			let bit = 0x80 >> (index % 8);
			this.torrent.bitefield[i] |= bit;
		}
	}

	ask_block(piece, start = 0)
	{
		//		ASK THE RIGHT OFFSET - LAST BLOCK MAY BE CUT
		/* 2^14 (16 kiB) */
		let offset = Math.pow(2, 14);

		let buffer = Buffer.alloc(17);

		buffer.writeUInt32BE(13, 0);
		buffer.writeUInt8(6, 4);
		buffer.writeUInt32BE(piece, 5);
		buffer.writeUInt32BE(start, 9);
		buffer.writeUInt32BE(offset, 13);

		this.client.write(buffer, 'binary');
	}

	send_handshake()
	{
		let buf = Buffer.alloc(49 + this.bt_cli.protocol.length, 0, 'binary');
		buf[0] = this.bt_cli.protocol.length;
		buf.write(this.bt_cli.protocol, 1, 'binary');
		this.info_hash.copy(buf, 28);
		this.peer_id.copy(buf, 48);

		this.client.write(buf, 'binary');
	}

	get_handshake()
	{
		let pstrlen = this.buffer[0];
		if (!this.buffer.length || this.buffer.length < 49 + pstrlen)
			return ;
		let pstr = this.buffer.slice(1, 1 + pstrlen);
		let reserved = this.buffer.slice(1 + pstrlen, 9 + pstrlen);
		let info_hash = this.buffer.slice(9 + pstrlen, 29 + pstrlen);
		let id_peer = this.buffer.slice(29 + pstrlen, 49 + pstrlen);
		if (Buffer.compare(this.info_hash, info_hash))
		{
			this.client.destroy();
			console.log("Handshake info_hash not corresponding from " + this.ip);
			// REMOVE SELF FROM this.torrent.peer
			return;
		}
		this.buffer = this.buffer.slice(49 + pstrlen);
		this.handshacked = true;
		console.log("Connected to " + this.ip);
		//
		// I SHOULD SEND MY BITEFIELD HERE
		//
		this.emit('ready');
	}
}

module.exports = peer;
