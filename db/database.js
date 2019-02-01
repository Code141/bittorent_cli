const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/mydb";

router
	.use((req, res, next) => {
		res.send({status: false});
		next ();
	})
	.get('/get', (req, res) => {
		MongoClient.connect(url, function (err, client) {
			if (err) throw err;
			var db = client.db("mydb");
			var collection = db.collection("customers");
			var query = {};
			var cursor = collection.find(query);
			cursor.forEach(
				function(doc) { console.log(doc); },
				function(err) { client.close(); }
			);
		});
	})
	.get('/insert', (req, res) => {
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			var myobj = { name: "Company Inc", lastname: "toto", address: "Highway 37" };
			dbo.collection("customers").insertOne(myobj, function(err, res) {
				if (err) throw err;
				console.log("1 document inserted");
				db.close();
			});
		});
	})
	.use((req, res) => {
		res.send({status: false});
	})

module.exports = router;
