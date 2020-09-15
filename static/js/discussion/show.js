const email = localStorage.getItem("email")
const password = localStorage.getItem("password")
const mailUser = document.getElementById('user')
mailUser.appendChild(document.createTextNode(email))

const requestStatusDone = 4


function signOut() {
    localStorage.clear()
    window.location.replace("../../index.html")
}


function deleteMessage(idMess){
    if (!confirm('Are you sure?')) {
        return
    }

    let request = new XMLHttpRequest()
    request.open("DELETE", host + "/discussions/messages/" + idMess, true)
    request.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
    request.onload = () => {
        if (request.status == 204) {
            window.location.reload()
        } else {
            alert("Discussion has not been deleted")
        }
    }
    request.send()   
}


function setUpAddMessage(id){
    let addButton = document.getElementById('addMessage-form')
    addButton.onsubmit = ($event) => {
        let request = new XMLHttpRequest()
        request.open("POST", host + "/discussions/" + id + "/messages", false)
        request.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
        request.onload = () => {
            if (request.status == 201) {
                window.location.href = "./show.html?id="+id
            } else {
                alert("Your message has not been sent")
            }
        }
        request.send(JSON.stringify({ content: $event.target.elements['content'].value }))

        return false
    }
}

function createMessage(msg, mail)
{
    return createElement({
        tag:"tr",
        children:[
            {
                tag:"td",
                children :[mail]            
            },
            {
                tag:"td",
                children :[msg.content]            
            },
            {
                tag:"td",
                children :[`on ${msg.date.substring(0, 10)} at ${msg.date.substring(11, 16)}`]            
            },
            {
                tag:"td",
                children :[
                    {
                        tag: 'button',
                        properies: {
                            className: "btn btn-sm btn-danger ml-2",
                            onclick: ()=>{deleteMessage(msg.id)},
                        },
                        children: [
                            {
                                tag: 'i',
                                properies: {
                                    className: "fas fa-trash-alt",
                                },
                            },
                        ]
                    },
                ]            
            },
        ]
    })
}

function requestAllMessages(id){
    let getDiscussionRequest = new XMLHttpRequest()
    getDiscussionRequest.open('GET', host + '/discussions/' + id, true)
    getDiscussionRequest.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
    getDiscussionRequest.onload = () => {
        if (getDiscussionRequest.status != 200) {
            return
        }
        onDisscussionLoaded(JSON.parse(getDiscussionRequest.response))
    }

    getDiscussionRequest.send()
}

function onDisscussionLoaded(data){
    const discussion = document.getElementById('disc')
    const title = document.getElementById('title')
    title.innerText = data.subject
    if (data.message === undefined){
        return
    }
    for (const msg of data.message.reverse()) {
        loadUserNameAndCreateMessageIn(msg,discussion)
    }
}

function loadUserNameAndCreateMessageIn(msg,discussion){
        let requestUser = new XMLHttpRequest()
        requestUser.open('GET', host + '/users/'+ msg.user_id, true)
        requestUser.onload = () => {
            if (requestUser.status != 200) {
                return
            }
            discussion.appendChild(createMessage(msg, JSON.parse(requestUser.response).mail))
        }    
        requestUser.send()
}


window.onload = function(){
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const id = urlParams.get('id')

    setUpAddMessage(id)
    requestAllMessages(id)
}

