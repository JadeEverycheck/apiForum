package api

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"io/ioutil"
	"net/http"
	"new-forum/apiForum/response"
	"strconv"
)

type User struct {
	Id       int `gorm:"primaryKey; autoIncrement"`
	Mail     string
	Password string
	Message  []DBMessage
}

type JsonUser struct {
	Id   int    `json:"id"`
	Mail string `json:"mail"`
}

func GetAllUsers(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		users := []User{}
		result := db.Find(&users)
		if result.Error != nil {
			response.ServerError(w, result.Error.Error())
		}

		jsonUsers := make([]JsonUser, 0, len(users))
		for _, u := range users {
			jsonUsers = append(jsonUsers, JsonUser{Id: u.Id, Mail: u.Mail})
		}
		response.Ok(w, jsonUsers)
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
		if user.Id != 0 {
			response.Ok(w, user)
		}
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
		hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.MinCost)
		if err != nil {
			response.ServerError(w, err.Error())
			return
		}
		if len(u.Mail) == 0 {
			response.BadRequest(w, "length of field `mail` must be positive")
			return
		}

		if len(u.Password) == 0 {
			response.BadRequest(w, "length of field `password` must be positive")
			return
		}

		fetched := User{}
		result := db.Where("mail = ?", u.Mail).First(&fetched)
		if result.Error == nil && fetched.Id != 0 {
			response.BadRequest(w, "email already used")
			return
		}

		user := User{Mail: u.Mail, Password: string(hash)}
		result = db.Create(&user)
		if result.Error != nil {
			response.ServerError(w, result.Error.Error())
			return
		}

		response.Created(w, JsonUser{
			Id:   user.Id,
			Mail: user.Mail,
		})
	}
}
