package middleware

import (
	"fmt"
	"gorm.io/gorm"
	"net/http"
	"new-forum/apiForum/api"
)

func BasicAuth(db *gorm.DB) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			email, pass, ok := r.BasicAuth()
			if !ok {
				basicAuthFailed(w)
				return
			}
			user := api.User{}
			result := db.Where("email = ?", email).First(&user)
			if result.Error != nil {
				basicAuthFailed(w)
				return
			}

			if pass != user.Password {
				basicAuthFailed(w)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func basicAuthFailed(w http.ResponseWriter) {
	w.Header().Add("WWW-Authenticate", fmt.Sprintf(`Basic realm="%s"`, "realm"))
	w.WriteHeader(http.StatusUnauthorized)
}
