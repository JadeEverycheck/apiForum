const discussions = document.getElementById('disc')
const mail = document.getElementById('user')
let email = localStorage.getItem("email")
let password = localStorage.getItem("password")

function signOut() {
    localStorage.clear()
    window.location.replace("../../index.html")
}

function deleteDiscussion(id){
    if (confirm('Are you sure?')) {
        let request = new XMLHttpRequest()
        request.open("DELETE", host + "/discussions/" + id, true)
        request.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
        request.send(null)   
        request.onload = () => {
            if (request.status == 204) {
                window.location.replace("./list.html")
            } else {
                alert("Discussion has not been deleted")
            }
        }
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

window.onload = function(){
    let request = new XMLHttpRequest()
    const deleteButton = document.getElementById('delete')
    mail.appendChild(document.createTextNode(email))
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
        	data = JSON.parse(request.response)
            for (const discussion of data) {
                discussions.appendChild(createListItem(discussion))
            }
        }
    }


    request.open('GET', host + '/discussions/', true)
	request.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
    request.send()
    return false
}