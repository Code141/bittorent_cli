class bencode
{
	constructor(buffer)
	{
		this.buffer = buffer;
		this.buffer_length = buffer.length;
		this.i = 0;

		try
		{
			this.data = this.read();
		}
		catch (e)
		{
			this.data = null;
			if (this.i != 0)
			{
				throw "Bencode: " + e + " at offset " + this.i;
			}
			throw "Bencode: Ressource given is not readeable";
		}
	}

	read()
	{
		while (this.i < this.buffer_length)
		{
			if (this.buffer[this.i] >= 48 && this.buffer[this.i] <= 57)
				return this.string();

			if (this.buffer[this.i] == 108)
				var data = this.list();
			else if (this.buffer[this.i] == 100)
				var data = this.dictionary();
			else if (this.buffer[this.i] == 105)
				var data = this.integer();
			else
			{
				console.log( this.i + " + " + this.buffer_length);
				throw "Unknow error";
			}

			if (this.buffer[this.i] != 101)
				throw "Item not correctly finished";
			this.i++;
			return data;
		}
	}

	string()
	{
		let nb = 0;

		while (this.i < this.buffer_length
			&& this.buffer[this.i] >= 48 && this.buffer[this.i] <= 57)
			nb = (nb * 10) + (this.buffer[this.i++] - 48);
		if (this.buffer[this.i] != 58)
			throw "No ':' separator found while evaluating a string";
		this.i++;

		var str = this.buffer.toString('binary', this.i, this.i + nb);

		this.i += nb;
		return str;
	}

	integer()
	{
		let nb = 0;
		let neg = 0;

		this.i++;
		if (this.buffer[this.i] == 45)
		{
			neg = 1;
			this.i++;
			if (this.buffer[this.i] == 48)
				throw "negative 0 while evaluating an integer";
		}
		else if (this.buffer[this.i] == 48
			&& this.buffer[this.i + 1] != 101)
			throw "leading 0 while evaluating an integer";

		while (this.i < this.buffer_length
			&& this.buffer[this.i] >= 48 && this.buffer[this.i] <= 57)
			nb = (nb * 10) + (this.buffer[this.i++] - 48);
		return (!neg) ? nb : -nb;
	}

	dictionary()
	{
		var dict = Object();

		this.i++;
		while (this.i < this.buffer_length && this.buffer[this.i] != 101)
		{
			let key = this.read();
			if (typeof key !== 'string')
				throw "a dictionary key must be typeof string";
			let val = this.read();
			dict[key] = val;
		}
		return dict;
	}

	list()
	{
		var list = Array();

		this.i++;
		while (this.i < this.buffer_length && this.buffer[this.i] != 101)
			list.push(this.read());
		return list;
	}
}

bencode.encode = function(data)
	{
		var str = "";

		if (typeof data == 'string')
			str = data.length + ":" + data;
		else if (typeof data == 'number')
			str = "i" + data + "e";
		else if (typeof data == 'object')
			if (Array.isArray(data))
			{
				data.forEach(element => {
					str += bencode.encode(element);
				})
				str = "l" + str + "e";
			}
			else
			{
				Object.keys(data).forEach(key => {
					str += bencode.encode(key) + "" + bencode.encode(data[key]);
				});
				str = "d" + str + "e";
			}
		else
			throw "Encoding error";
		return str;
	}


module.exports = bencode;

