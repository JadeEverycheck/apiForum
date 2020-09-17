const discussions = document.getElementById('disc')
const email = localStorage.getItem('mail')
const password = localStorage.getItem('password')
let user = document.getElementById('user')

function signOut() {
	localStorage.clear()
	window.location.replace('../../index.html')
}

function deleteDiscussion(discussion){
	if (confirm('Are you sure ? ')) {
		let request = new XMLHttpRequest()
		request.open('DELETE', host + '/discussions/' + discussion.Id, true)
		request.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
		request.onload = () => {
			if (request.status == 204) {
				window.location.reload()
			} else {
				alert('Discussion has not been deleted')
			}
		}
		request.send()
	}
}

function createListItem(discussion)
{
    const listItem = createElement({
        tag:'li',
        properies:{
            className: "list-group-item d-flex justify-content-between align-items-center bg-light mb-2 border", 
        },
        children: [
            discussion.subject,
            {
                tag:"div",
                children:[
                    {
                        tag: 'a', 
                        properies: {
                            className: "btn btn-sm btn-primary",
                            href: "show.html?id="+discussion.id
                        }, 
                        children: [
                            {   
                                tag: 'i',
                                properies: {className: "fas fa-eye justify-content-md-center"}
                            },
                        ]
                    },
                    {
                        tag: 'button', 
                        properies: {
                            className: "btn btn-sm btn-danger ml-2",
                            onclick: ()=>{deleteDiscussion(discussion.id)}
                        }, 
                        children: [
                            {   
                                tag: 'i',
                                properies: {className: "fas fa-trash-alt justify-content-md-center"}
                            },
                        ]
                    },
                ]
            },
        ]
    })
 
    return listItem  
}

window.onload = function() {
	user.appendChild(document.createTextNode(email))
	let request = new XMLHttpRequest()
	request.open('GET', host + "/discussions/", true)
	request.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
	request.onload = function() {
		if (request.status != 200) {
			return
		}
		data = JSON.parse(request.response)
		for (const discussion of data) {
			discussions.appendChild(createListItem(discussion))
		}
	}
	request.send()
} 