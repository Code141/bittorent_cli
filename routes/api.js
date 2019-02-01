const router = require('express').Router();
const basecamp = require('../class/ninja');

module.exports = router;

router
	.use((req, res, next) => {
		if (!req.session.basecamp)
			req.session.basecamp = Array();
		b = new basecamp(req.session.basecamp);
		next()
	})
	.get('/', (req, res) => {
		res.send({status: true, basecamp: b.get_ninjas()});
	})
	.post('/', (req, res) => {
		res.send(b.set_ninjas(req.body.name));
	})
	.put('/:id', (req, res) => {
		res.send({status: true});
	})
	.delete('/:name', (req, res) => {
		res.send(b.del_ninjas(req.params.name));
	})
	.use((req, res) => {
		res.send({status: false});
	})

