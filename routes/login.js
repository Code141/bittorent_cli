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
		if(ddb.register(req.body.pseudo, req.body.password))
			res.send({status: true, response: "Created account"});
		else
			res.send({status: false, response: "User already existe"});
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

