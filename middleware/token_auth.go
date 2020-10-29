package middleware

import (
	"context"
	"fmt"
	"forum/api"
	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
	"net/http"
	"strings"
)

func TokenAuth(db *gorm.DB, secret []byte) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			//Get the JWT on the Authorization Header
			reqToken := r.Header.Get("Authorization")
			splitToken := strings.Split(reqToken, "Bearer ")
			if len(splitToken) != 2 {
				basicAuthFailed(w)
				return
			}
			reqToken = splitToken[1]
			token, err := jwt.Parse(reqToken, func(t *jwt.Token) (interface{}, error) {
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", t.Header["alg"])
				}
				return []byte(secret), nil
			})
			if err != nil {
				basicAuthFailed(w)
				return
			}
			if !token.Valid {
				basicAuthFailed(w)
				return
			}
			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				basicAuthFailed(w)
				return
			}
			if !token.Valid {
				basicAuthFailed(w)
				return
			}
			email, ok := claims["mail"]
			if !ok {
				basicAuthFailed(w)
				return
			}
			user := api.User{}
			result := db.Where("mail = ?", email).First(&user)
			if result.Error != nil {
				basicAuthFailed(w)
				return
			}
			ctx := context.WithValue(r.Context(), "user", user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
