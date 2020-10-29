package middleware

import (
	"context"
	"fmt"
	"forum/api"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
)

func BasicAuth(db *gorm.DB, secret []byte) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			email, pass, ok := r.BasicAuth()
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

			err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(pass))
			if err != nil {
				basicAuthFailed(w)
				return
			}

			ctx := context.WithValue(r.Context(), "user", user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func basicAuthFailed(w http.ResponseWriter) {
	w.Header().Add("WWW-Authenticate", fmt.Sprintf(`Basic realm="%s"`, "realm"))
	w.WriteHeader(http.StatusUnauthorized)
}
