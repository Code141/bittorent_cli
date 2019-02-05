const MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/mydb";

class db
{
	login() {
	}

	register (username, password) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var users = db.db("mydb").collection("users")


			users.find({username: username}).toArray((err, docs) => {
				if (!docs.length)
				{
					var req = { username: username, password: password };
					users.updateOne( req, { $set: req }, { upsert: true })
					return true;
				}
				else
					return false;
			});

		});
	}

	get_all() {
		MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
			if (err)
				throw err;
			var db = client.db("mydb");
			var collection = db.collection("customers");
			var query = {};
			var cursor = collection.find(query);
			cursor.forEach(
				function(doc) {
					console.log(doc);
				},
				function(err) {
					client.close();
				}
			);
		});
	}

	insert() {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err)
				throw err;
			var dbo = db.db("mydb");
			var myobj = { name: "Company Inc", lastname: "toto", address: "Highway 37" };
			dbo.collection("customers").insertOne(myobj, function(err, res) {
				if (err) throw err;
				console.log("1 document inserted");
				db.close();
			});
		});
	}
}

module.exports = db;
