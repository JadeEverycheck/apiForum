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
	Id       int         `json: "id" gorm:"primaryKey; autoIncrement"`
	Subject  string      `json: "subject"`
	Messages []DBMessage `json: "-"`
}

func GetAllDiscussions(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		discussions := []Discussion{}
		result := db.Find(&discussions)
		fmt.Println(result)
		if result.Error != nil {
			response.ServerError(w, result.Error.Error())
		}
		response.Ok(w, discussions)
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
