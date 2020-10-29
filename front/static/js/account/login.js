let login = document.getElementById('login-form')


login.onsubmit = function(e) {
	localStorage.setItem('mail', e.target.elements['email'].value)
	localStorage.setItem('password', e.target.elements['password'].value)
	window.location.replace('../discussion/list.html')
	return false
}