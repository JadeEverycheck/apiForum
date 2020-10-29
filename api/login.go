package api

import (
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"io/ioutil"
	"net/http"
	"new-forum/apiForum/response"
	"time"
)

type Identifiers struct {
	Mail     string `json:"email"`
	Password string `json:"password"`
}

type JWTEncoded struct {
	Mail string `json:"mail"`
	jwt.StandardClaims
}

type TokenBody struct {
	Tkn string `json:"token"`
}

func Login(db *gorm.DB, secret []byte) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			response.ServerError(w, err.Error())
			return
		}
		r.Body.Close()
		var id Identifiers
		err = json.Unmarshal(body, &id)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		user := User{}
		result := db.Where("Mail = ?", id.Mail).First(&user)
		if result.Error != nil {
			response.BadRequest(w, "Invalid credential")
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(id.Password))
		if err != nil {
			response.BadRequest(w, "Invalid credential")
			return
		}

		expirationTime := time.Now().Add(24 * time.Hour)
		jwtencoded := &JWTEncoded{
			Mail: id.Mail,
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: expirationTime.Unix(),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwtencoded)

		tokenString, err := token.SignedString(secret)
		if err != nil {
			response.BadRequest(w, err.Error())
			return
		}
		tokenBody := TokenBody{Tkn: tokenString}
		response.Created(w, tokenBody)
	}
}
