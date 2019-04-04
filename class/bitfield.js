class bitfield
{
	constructor (length)
	{
		this.bit_on = 0;
		this.length = length;
		this.buffer = Buffer.alloc(length);
	}

	read(index)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);
		if (i >= this.buffer.length)
			throw "bitfield_read bad offset";
		return (this.buffer[i] & bit);
	}

	set(index)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);
		if (i >= this.buffer.length)
			throw "bitfield_set bad offset";

		if (!(this.buffer[i] & bit))
		{
			this.buffer[i] |= bit;
			this.bitfield_on++;
		}
	}

	unset(index)
	{
		let i = Math.floor(index / 8);
		let bit = 0x80 >> (index % 8);
		if (i >= this.buffer.length)
			throw "bitfield_set bad offset";

		if (this.buffer[i] & bit)
		{
			this.buffer[i] &= ~(bit);
			this.bit_on--;
		}
	}

	next(index = 0)
	{
		let i = Math.floor(index / 8);

		while (i < this.length && this.buffer[i] === 0xff)
			i++;

		if (i < this.length)
			return (-1);

		let j = index % 8;
		let bit = 0x80 >> (index % 8);

		while (this.buffer[i] & bit)
		{
			bit = bit >> 1;
			j++;
		}
		if (bit)
			return i * 8 + j;
		else
			return (-1);
	}

}

module.exports = bitfield;
