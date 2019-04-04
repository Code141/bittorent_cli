"use strict";
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

	.listen(process.env.port || 8081, () => {
		console.log('- Server now listning -');
	})



/*
const http = require('http');
const WebSocketServer = require('websocket').server;
var server = http.createServer(function(request, response) {
	// process HTTP request. Since we're writing just WebSockets
	// server we don't have to implement anything.
});
server.listen(1337, function() { });
wsServer = new WebSocketServer({ httpServer: server });
wsServer.on('request', function(request) {
	var connection = request.accept(null, request.origin);
	connection
		.on('message', function(message) {
			if (message.type === 'utf8') {
				console.log("HELLO");
				console.log(message);
				connection.sendUTF(
				JSON.stringify({ type:'color', data: "DAAATAAA" }));
				// process WebSocket message
			}
		})
		.on('close', function(connection) {
		});
});
*/
