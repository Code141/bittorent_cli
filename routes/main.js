const router = require('express').Router();

router
	.use('/api/ninjas', require('./api'))
	.use('/api/torrent', require('./torrent'))
	.use('/login', require('./login'))
	.use('/', (req, res) => {
		res.setHeader('Content-Type', 'text/html')
		res.sendFile(__basedir + "/html/index.html");
	})
	.use((req, res) => {
		res.send("404")
		res.end()
	})

module.exports = router;
