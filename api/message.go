package api

import (
	"encoding/json"
	"forum/response"
	"github.com/go-chi/chi"
	"gorm.io/gorm"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"
)

type DBMessage struct {
	Id           int
	Content      string
	Date         time.Time
	UserId       int
	DiscussionId int
}

func (DBMessage) TableName() string {
	return "messages"
}

type JsonMessage struct {
	Id      int       `json:"id"`
	Content string    `json:"content"`
	Date    time.Time `json:"date"`
	User    JsonUser  `json:"user"`
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

		messages := []DBMessage{}
		err = db.Model(&discussion).Association("Messages").Find(&messages)
		if err != nil {
			response.ServerError(w, err.Error())
		}

		userIds := []int{}
		userIdsLoaded := map[int]struct{}{}
		for _, msg := range messages {
			id := msg.UserId
			_, ok := userIdsLoaded[id]
			if ok {
				continue
			}
			userIds = append(userIds, id)
			userIdsLoaded[id] = struct{}{}
		}

		users := []User{}
		result = db.Where(userIds).Find(&users)
		if result.Error != nil {
			response.ServerError(w, result.Error.Error())
		}

		mailFromId := map[int]string{}
		for _, u := range users {
			mailFromId[u.Id] = u.Mail
		}

		jsonMessages := make([]JsonMessage, 0, len(messages))
		for _, msg := range messages {
			jsonMessages = append(jsonMessages, JsonMessage{
				Id:      msg.Id,
				Content: msg.Content,
				Date:    msg.Date,
				User:    JsonUser{Id: msg.UserId, Mail: mailFromId[msg.UserId]},
			})
		}

		response.Ok(w, jsonMessages)
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
		message := DBMessage{}
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
		result := db.Delete(&DBMessage{}, index)
		if result.Error != nil {
			response.NotFound(w)
		}
		response.Deleted(w)
	}
}

func CreateMessage(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		user, ok := r.Context().Value("user").(User)
		if !ok {
			response.ServerError(w, "User not registered")
		}

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
		var m DBMessage
		err = json.Unmarshal(body, &m)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		message := DBMessage{Content: m.Content, DiscussionId: discussion.Id, UserId: user.Id, Date: time.Now()}
		result = db.Create(&message)
		if result.Error != nil {
			response.ServerError(w, result.Error.Error())
		}
		response.Created(w, JsonMessage{
			Id:      message.Id,
			Content: message.Content,
			Date:    message.Date,
			User: JsonUser{
				Id:   user.Id,
				Mail: user.Mail,
			},
		})
	}
}
