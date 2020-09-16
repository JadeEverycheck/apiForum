
let host = localStorage.getItem('host')
console.log('host : ', host)
if (host == null) {
	localStorage.setItem('host', "https://serene-shore-48766.herokuapp.com")
	// localStorage.setItem('host', "http://localhost:8080")
	host = localStorage.getItem('host')
}

