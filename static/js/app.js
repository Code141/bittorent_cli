window.onload = () => {

	var app = new Vue({
		el: '#app',
		data: {
			errors: Array(),
			new_ninja_name: "",
			ninja_basecamp: [
			]
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
};
