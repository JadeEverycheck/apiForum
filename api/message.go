package api

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"io/ioutil"
	"net/http"
	"new-forum/apiForum/response"
	"strconv"
	"time"
)

type Message struct {
	Id      int       `json: "id"`
	Content string    `json: "content"`
	Date    time.Time `json: "date"`
	UserId  int       `json: "user id"`
}

var messageCount = 0
var users = []User{}

func appendMessage(content string, uId int, disc *Discussion) Message {
	messageCount++
	var m = Message{
		Id:      messageCount,
		Content: content,
		Date:    time.Now(),
		UserId:  uId,
	}
	disc.Mess = append(disc.Mess, m)
	return m
}

func removeMessage(m Message) {
	indexDisc := -1
	indexMess := -1
	for i, disc := range discussions {
		for j, mess := range disc.Mess {
			if mess.Id == m.Id {
				indexDisc = i
				indexMess = j
				break
			}
		}
	}
	if indexMess == -1 || indexDisc == -1 {
		return
	}
	copy(discussions[indexDisc].Mess[indexMess:], discussions[indexDisc].Mess[indexMess+1:])
	discussions[indexDisc].Mess = discussions[indexDisc].Mess[:len(discussions[indexDisc].Mess)-1]
	return
}

func GetAllMessages(w http.ResponseWriter, r *http.Request) {
	data := chi.URLParam(r, "id")
	index, err := strconv.Atoi(data)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}
	for _, disc := range discussions {
		if disc.Id == index {
			response.Ok(w, disc.Mess)
			return
		}
	}
	response.NotFound(w)
}

func GetMessage(w http.ResponseWriter, r *http.Request) {
	data := chi.URLParam(r, "id")
	index, err := strconv.Atoi(data)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}
	for _, disc := range discussions {
		for _, mess := range disc.Mess {
			if mess.Id == index {
				response.Ok(w, mess)
				return
			}
		}
	}
	response.NotFound(w)
}

func DeleteMessage(w http.ResponseWriter, r *http.Request) {
	data := chi.URLParam(r, "id")
	index, err := strconv.Atoi(data)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}
	removeMessage(Message{Id: index})
	response.Deleted(w)
}

func CreateMessage(w http.ResponseWriter, r *http.Request) {
	data := chi.URLParam(r, "id")
	index, err := strconv.Atoi(data)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}
	d := &Discussion{}
	for i, disc := range discussions {
		if disc.Id == index {
			d = &discussions[i]
			break
		}
	}
	if d.Id == 0 {
		response.NotFound(w)
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		response.ServerError(w, err.Error())
		return
	}
	r.Body.Close()
	var m Message
	err = json.Unmarshal(body, &m)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}
	username, _, _ := r.BasicAuth()
	user := User{}
	for _, u := range users {
		if u.Mail == username {
			user = u
		}
	}
	response.Created(w, appendMessage(m.Content, user.Id, d))
	return
}
