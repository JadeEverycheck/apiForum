package api

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"gorm.io/gorm"
	"io/ioutil"
	"net/http"
	"new-forum/apiForum/response"
	"strconv"
)

type Discussion struct {
	Id       int `gorm:"primaryKey; autoIncrement"`
	Subject  string
	Messages []DBMessage
	StaredId int
	Stared   *DBMessage
}

type JsonDiscussion struct {
	Id      int                `json:"id"`
	Subject string             `json:"subject"`
	Stared  *JsonStaredMessage `json:"stared,omitempty"`
}

type JsonStaredMessage struct {
	Id      int    `json:"id"`
	Content string `json:"content"`
}

func GetAllDiscussions(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		discussions := []Discussion{}
		result := db.Preload("Stared").Find(&discussions)
		fmt.Println(result)
		if result.Error != nil {
			response.ServerError(w, result.Error.Error())
		}

		jsonDiscussions := make([]JsonDiscussion, 0, len(discussions))
		for _, d := range discussions {
			jd := JsonDiscussion{
				Id:      d.Id,
				Subject: d.Subject,
			}
			fmt.Println(d)
			if d.StaredId != 0 {
				jd.Stared = &JsonStaredMessage{
					Id:      d.Stared.Id,
					Content: d.Stared.Content,
				}
			}
			jsonDiscussions = append(jsonDiscussions, jd)
		}
		response.Ok(w, jsonDiscussions)
	}
}

func GetDiscussion(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
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
		if discussion.Id != 0 {
			response.Ok(w, discussion)
		}
	}
}

func DeleteDiscussion(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		data := chi.URLParam(r, "id")
		index, err := strconv.Atoi(data)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		result := db.Delete(&Discussion{}, index)
		if result.Error != nil {
			response.NotFound(w)
		}
		response.Deleted(w)
	}
}

func CreateDiscussion(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			response.ServerError(w, err.Error())
			return
		}
		r.Body.Close()
		var d Discussion
		err = json.Unmarshal(body, &d)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		discussion := Discussion{Subject: d.Subject}
		result := db.Create(&discussion)
		if result.Error != nil {
			response.ServerError(w, result.Error.Error())
		}
		response.Created(w, discussion)
	}
}

func UpdateDiscussion(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
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
			return
		}
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			response.ServerError(w, err.Error())
			return
		}
		r.Body.Close()
		var updated Discussion
		err = json.Unmarshal(body, &updated)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		discussion.Subject = updated.Subject

		if updated.StaredId == 0 {
			discussion.StaredId = 0
			discussion.Stared = nil
		} else {
			message := DBMessage{}
			result := db.Where("id = ?", updated.StaredId).Find(&message)
			if result.Error != nil {
				response.ServerError(w, result.Error.Error())
				return
			}
			if message.DiscussionId != discussion.Id {
				response.BadRequest(w, "Message is not int this discussion")
				return
			}
			discussion.Stared = &message
			discussion.StaredId = updated.StaredId
		}

		result = db.Save(&discussion)
		if result.Error != nil {
			response.ServerError(w, result.Error.Error())
		}
		response.Ok(w, discussion)
	}
}
