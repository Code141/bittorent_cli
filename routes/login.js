const router = require('express').Router();
const db = require('../class/db');

module.exports = router;

router
	.use((req, res, next) => {
		console.log("hello");
		ddb = new db();
		next ();
	})
	.post('/register', (req, res, next) => {
		console.log(req.body.pseudo);
		console.log(req.body.password);
		ddb.register(req.body.pseudo, req.body.password);
		next ();
	})
	.post('/', (req, res, next) => {
		json = ddb.login();
		console.log(json);
		res.send({status: false, response: json});
	})
	.use((req, res) => {
		console.log("end");
		res.send({status: false, from: "login"});
	})

