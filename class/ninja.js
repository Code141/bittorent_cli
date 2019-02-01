class basecamp
{
	constructor(ninjas = Array())
	{
		if (ninjas)
			this.ninjas = ninjas;
		else
			this.ninjas = [];
	}

	get_ninjas()
	{
		return (this.ninjas);
	}

	set_ninjas(name)
	{
		if (this.ninjas.find(element => { return element.name == name; }))
			return ({status: false, error: "Name already use"});
		let	ninja = { name: name };
		this.ninjas.push(ninja);
		return ({status: true, ninja: ninja});
	}

	del_ninjas(name)
	{
		let index = this.ninjas.findIndex(n => { return n.name == name; });
		if (index == -1)
			return ({status: false, error: "Ninja not found"});
		let ninja = this.ninjas.splice(index, 1);
		return ({status: true, ninja: ninja});
	}
}

module.exports = basecamp;

