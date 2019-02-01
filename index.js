const express = require('express');

const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

global.__basedir = __dirname;

app
	.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }))
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use(express.static('static'))

	.use('/', require('./routes/main'))

	.listen(process.env.port || 8080, () => {
		console.log('- Server now listning -');
	})

