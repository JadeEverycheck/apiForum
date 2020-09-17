let discForm = document.getElementById('newDisc-form')
const email = localStorage.getItem('mail')
const password = localStorage.getItem('password')

function signOut() {
	localStorage.clear()
	window.location.replace('../../index.html')
}

discForm.onsubmit = function(e) {
	let request = new XMLHttpRequest()
	request.open('POST', '/discussions/', true)
	request.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
	request.onload = () => {
		if (request.status == 201) {
			window.location.replace('../../html/discussion/list.html')
		} else {
			alert('Discussion has not been created')
		}
	}
	request.send(JSON.stringify({subject : e.target.elements['subject'].value}))
	return false
}

window.onload = () => {
	let user = document.getElementById('user')
	user.appendChild(document.createTextNode(email))
}
