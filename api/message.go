package api

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"gorm.io/gorm"
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
	// UserId       int       `json: "user_id"`
	DiscussionId int `json: "discussion_id"`
}

func GetAllMessages(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		data := chi.URLParam(r, "id")
		index, err := strconv.Atoi(data)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		discussion := Discussion{}
		result := db.First(&discussion, index)
		if result.Error != nil {
			response.NotFound(w)
		}
		if discussion.Id == 0 {
			response.NotFound(w)
		}

		messages := []Message{}
		err = db.Model(&discussion).Association("Messages").Find(&messages)
		if err != nil {
			response.ServerError(w, err.Error())
		}
		response.Ok(w, messages)
	}
}

func GetMessage(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		data := chi.URLParam(r, "id")
		index, err := strconv.Atoi(data)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		message := Message{}
		result := db.First(&message, index)
		if result.Error != nil {
			response.NotFound(w)
		}
		if message.Id != 0 {
			response.Ok(w, message)
		}
	}
}

func DeleteMessage(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		data := chi.URLParam(r, "id")
		index, err := strconv.Atoi(data)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		result := db.Delete(&Message{}, index)
		if result.Error != nil {
			response.NotFound(w)
		}
		response.Deleted(w)
	}
}

func CreateMessage(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		data := chi.URLParam(r, "id")
		index, err := strconv.Atoi(data)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		discussion := Discussion{}
		result := db.First(&discussion, index)
		if result.Error != nil {
			response.NotFound(w)
		}
		if discussion.Id == 0 {
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
		message := Message{Content: m.Content, DiscussionId: discussion.Id}
		result = db.Create(&message)
		if result.Error != nil {
			response.ServerError(w, result.Error.Error())
		}
		response.Created(w, message)
	}
}
