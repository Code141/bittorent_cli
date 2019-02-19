const net = require('net');

const ByteBuffer = require("bytebuffer");

class peer
{
	constructor(info_hash, peer_id, p)
	{
		this.protocol = "BitTorrent protocol";
		this.info_hash = info_hash;
		this.peer_id = torrent.info_hash;
		this.ip = p.ip;
		this.port = p.port;
		this.buffer = Buffer.alloc(0);
		this.handshacked = false;

		this.am_choked = true;
		this.am_interested = false;

		this.peer_choked = true;
		this.peer_interested = false;

		this.bitefield = Buffer.alloc(0);

		this.client = new net.Socket();
		this.client.setEncoding('binary');

		this.client
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
				console.log(err);
			})
			.connect(this.port, this.ip, () => { });

		//		this.client.destroy(); // kill client after server's this.buffer
	}

	read(data)
	{
		this.buffer = Buffer.concat([this.buffer, new Buffer.from(data, 'binary')]);

		if (!this.handshacked)
			this.handshake();

		if (this.handshacked)
			this.message();
	}

	message()
	{
		console.log("------------------------------------------------------------");
		if (this.buffer.length < 4)
			return;

		let length = this.buffer.readUInt32BE(0);
		if (length == 0)
		{
			console.log("Keep alive");
			this.buffer = this.buffer.slice(4);
			return ;
		}
		if (length + 4 > this.buffer.length)
			return;


		let id_message = this.buffer.readUInt8(4);
		let payload = this.buffer.slice(5, 5 + length - 1);


		if (id_message == 0)
		{
			console.log("Choke");
			this.am_choked = true;
		}
		else if (id_message == 1)
		{
			console.log("Unchoke");
			this.am_choked = false;
		}
		else if (id_message == 2)
		{
			console.log("Interested");
			this.peer_interested = true;
		}
		else if (id_message == 3)
		{
			console.log("Not-Interested");
			this.peer_interested = false;
		}

		else if (id_message == 4)
		{
			console.log("Have");
			// this.bitefield[index / 8] |= index % 8;
		}
		else if (id_message == 5)
		{
			console.log("Bitfield");
			console.log(length);
			console.log(payload.slice(length - 10));
			// check if bitfield length is correponding to nb of pieces
			this.bitefield = payload;
		}
		else if (id_message == 6)
			console.log("Request");
		else if (id_message == 7)
			console.log("Piece");
		else if (id_message == 8)
		{
			// if recieved cancel curent uploading
			console.log("Cancel");
		}
		else if (id_message == 9)
			console.log("Port");
		else
			console.log("Id message from peer error");

//		console.log(payload);

		this.buffer = this.buffer.slice(4 + length);
		this.message();
	}

	send_handshake()
	{
		console.log('Connected at ' + this.ip + ':' + this.port);

		var info_hash_buffer = ByteBuffer.fromHex(this.info_hash).buffer;
		var peer_id_buffer = ByteBuffer.fromHex(this.peer_id).buffer;

		let buf = Buffer.alloc(49 + this.protocol.length, 0, 'binary');
		buf[0] = this.protocol.length;
		buf.write(this.protocol, 1, 'binary');
		info_hash_buffer.copy(buf, 28);
		peer_id_buffer.copy(buf, 48);

		this.client.write(buf, 'binary');
	}

	handshake()
	{
		let pstrlen = this.buffer[0];
		if (!this.buffer.length)
			return ;


		if (this.buffer.length < 49 + pstrlen)
			return ;

		let pstr = this.buffer.slice(1, 1 + pstrlen);
		let reserved = this.buffer.slice(1 + pstrlen, 9 + pstrlen);
		let info_hash = this.buffer.slice(9 + pstrlen, 29 + pstrlen);
		let id_peer = this.buffer.slice(29 + pstrlen, 49 + pstrlen);




		let remaind = this.buffer.slice(49 + pstrlen);

		this.buffer = this.buffer.slice(49 + pstrlen);
		this.handshacked = true;
		/*
		console.log("--------------------------------------------");
		console.log(this.buffer);
		console.log(pstr);
		console.log(pstr.toString('binary'));
		console.log(reserved);
		console.log(info_hash);				// MUST CHECK INFO HASH if not close conn
		console.log(info_hash.toString('binary'));
		console.log(id_peer);
		console.log(id_peer.toString('binary'));

		console.log(remaind);
		console.log(remaind.toString('binary'));
		console.log("----------------------");
		 */

		//
		// I MUST SEND MY BITEFIELD HERE
		//
	}
}

module.exports = peer;
