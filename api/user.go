package api

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"gorm.io/gorm"
	"io/ioutil"
	"net/http"
	"new-forum/apiForum/response"
	"strconv"
)

type User struct {
	Id       int    `json: "id" gorm:"primaryKey; autoIncrement"`
	Mail     string `json: "mail"`
	Password string `json: "password"`
}

func GetAllUsers(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		users := []User{}
		result := db.Find(&users)
		if result.Error != nil {
			response.ServerError(w, result.Error.Error())
		}
		response.Ok(w, users)
	}
}

func GetUser(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		data := chi.URLParam(r, "id")
		index, err := strconv.Atoi(data)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		user := User{}
		result := db.First(&user, index)
		if result.Error != nil {
			response.NotFound(w)
		}
		response.Ok(w, user)
	}
}

func CreateUser(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			response.ServerError(w, err.Error())
			return
		}
		r.Body.Close()
		var u User
		err = json.Unmarshal(body, &u)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		user := User{Mail: u.Mail, Password: u.Password}
		result := db.Create(&user)
		if result.Error != nil {
			response.ServerError(w, result.Error.Error())
		}
		response.Created(w, user)
	}
}
