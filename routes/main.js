const router = require('express').Router();

module.exports = router;

router
	.use('/api/ninjas', require('./api'))
	.use('/login', require('./login'))
	.use('/', (req, res) => {
		res.setHeader('Content-Type', 'text/html')
		res.sendFile(__basedir + "/html/index.html");
	})
	.use((req, res) => {
		res.send("404")
		res.end()
	})

