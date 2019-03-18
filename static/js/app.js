window.onload = () => {
	var app = new Vue({
		el: '#app',
		data: {
			errors: Array(),
			new_ninja_name: "",
			ninja_basecamp: [
			],
			torrents_list: []
		},
		mounted() {
			this.get_ninjas();
		},
		methods: {
			delete_error: function (e){
				index = this.errors.findIndex(
					(el) => {
						return el == e;
					}
				);
				this.errors.splice(index, 1);
			},
			new_ninja: function (){
				axios.post("/api/ninjas", {name: this.new_ninja_name})
					.then(response => {
						if (response.data.status === true)
							this.ninja_basecamp.push(response.data.ninja);
						else
							this.errors.push(response.data.error);
					})
					.catch(e => {
						this.errors.push(e)
					})
			},
			get_ninjas: function (){
				axios.get("/api/ninjas")
					.then(response => {
						this.ninja_basecamp = response.data.basecamp;
					})
					.catch(e => {
						this.error.push(e)
					})
			},
			get_torrents: function (){
				axios.get("/api/torrent")
					.then(response => {
						console.log(response.data.torrents);
						//						this.torrents_list = response.data.torrents;
					})
					.catch(e => {
						this.error.push(e)
					})
			},
			kill_ninja: function (ninja){
				axios.delete("/api/ninjas/" + ninja.name)
					.then(response => {
						if (response.data.status === true)
						{
							index = this.ninja_basecamp.findIndex( (el) => { return el.name == ninja.name; });
							this.ninja_basecamp.splice(index, 1);
						}
						else
							this.errors.push(response.data.error);
					})
					.catch(e => {
						this.error.push(e)
					})
			}
		}
	})







/*

		// if user is running mozilla then use it's built-in WebSocket
		window.WebSocket = window.WebSocket || window.MozWebSocket;

		var connection = new WebSocket('ws://127.0.0.1:1337');

		connection.onopen = function () {
			connection.send("Voici un texte que le serveur attend de recevoir dès que possible !");
			// connection is opened and ready to use
		};

		connection.onerror = function (error) {
			// an error occurred when sending/receiving data
		};

		connection.onmessage = function (message) {
			// try to decode json (I assume that each message
			// from server is json)

				console.log('MESSAGE');
			try {
				var json = JSON.parse(message.data);
			} catch (e) {
				console.log('This doesn\'t look like a valid JSON: ',
					message.data);
				return;
			}
			// handle incoming message
		};
*/

};
