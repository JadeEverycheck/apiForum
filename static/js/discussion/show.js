const email = localStorage.getItem('mail')
const password = localStorage.getItem('password')
let queryString = window.location.search
let urlParams = new URLSearchParams(queryString)
let id = urlParams.get('id')

function signOut() {
	localStorage.clear()
	window.location.replace('../../index.html')
}

function addMessage() {
	let addMessageForm = document.getElementById('addMessage-form')
	addMessageForm.onsubmit = (e) => {
		let addMessageRequest = new XMLHttpRequest()
		addMessageRequest.open('POST', host + '/discussions/' + id + '/messages', false)
		addMessageRequest.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
		addMessageRequest.onload = () => {
			if (addMessageRequest.status == 201) {
				window.location.replace('./show.html?id=' + id)
			} else {
				alert('Your message has not been added')
			}
		}
		addMessageRequest.send(JSON.stringify({content : e.target.elements['content'].value}))
		return false
	}
}

window.onload = function() {
	let user = document.getElementById('user')
	user.appendChild(document.createTextNode(email))
	addMessage()
	let request = new XMLHttpRequest()
	request.open('GET', host + '/discussions/' + id, true)
	request.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
	request.onload = function() {
		if (request.status !== 200) {
			return
		}
		giveTitle(request.response)
		loadMessage(request.response)
	}
	request.send(null)
	return false
}


function giveTitle(data) {
	let title = document.getElementById('title')
	let subject = JSON.parse(data)
	title.innerText = subject.Subject
	return
}

function loadMessage(data) {
	if (JSON.parse(data).Mess == undefined) {
		return
	}
	let discussion = document.getElementById("messages")
	for (const message of JSON.parse(data).Mess.reverse()) {
		getUserMail(message, discussion)
	}
}

function getUserMail(data, discussion) {
	let userId = data.UserId
	let getUser = new XMLHttpRequest()
	getUser.open('GET', host + '/users/' + userId, true)
	getUser.onload = function() {
		if (getUser.status !== 200) {
			return
		}
		discussion.appendChild(createMessage(data, JSON.parse(getUser.response).Mail))
	}
	getUser.send()
}

function createMessage(data, mail) {
	let listMessages = createElement({
		tag: "tr",
		children: [
			{
				tag: "td",
				children: [mail],
			},
			{
				tag: "td",
				children: [data.Content],
			},
			{
				tag: "td",
				children: [`on ${data.Date.substring(0, 10)} at ${data.Date.substring(11, 16)}`],          
			},
			{
				tag: "td",
				children: [
					{
						tag: "button",
						properies: { className: "btn btn-danger btn-sm ml-2", 
									onclick: () => {deleteMessage(data)}},
						children : [
							{
								tag: "i",
								properies : {className :"fas fa-trash-alt"},
							},
						]
					}
				]
			}
		]
	})
	return listMessages
}

function deleteMessage(data) {
	if (confirm('Are you sure ? ')) {
		let deleteRequest = new XMLHttpRequest()
		deleteRequest.open('DELETE', host + '/discussions/messages/' + data.Id, true)
		deleteRequest.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
		deleteRequest.onload = () => {
			if (deleteRequest.status != 204) {
				return
			}
			window.location.reload()
		}
		deleteRequest.send()
	}
}