package main

import (
	"flag"
	"fmt"
	"forum/api"
	"forum/middleware"
	"github.com/go-chi/chi"
	chimiddleware "github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type RedirectToIndexFileSystem struct {
	fs http.FileSystem
}

func (ffs *RedirectToIndexFileSystem) Open(name string) (http.File, error) {
	file, err := ffs.fs.Open(name)
	if err != nil {
		return ffs.fs.Open("/index.html")
	}
	return file, nil
}

func ToRedirectToIndexFS(fs http.FileSystem) http.FileSystem {
	return &RedirectToIndexFileSystem{
		fs: fs,
	}
}

func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}

func main() {
	var jwtKey string
	var frontDistFolder string
	var corsEnabled bool

	flag.StringVar(&jwtKey, "secret", "unsecuredsecret", "choose a secret to generate jwt")
	flag.StringVar(&frontDistFolder, "front", "front/angular/build", "select where the front static site is")
	flag.BoolVar(&corsEnabled, "cors", false, "enable cors")
	flag.Parse()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println("Début du forum", port)

	db, err := gorm.Open(sqlite.Open("test.sqlite"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	r := chi.NewRouter()
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	if corsEnabled {
		r.Use(cors.Handler(cors.Options{
			AllowedOrigins:   []string{"*"},
			AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
			ExposedHeaders:   []string{"Link"},
			AllowCredentials: false,
			MaxAge:           300,
		}))
	}

	workDir, _ := os.Getwd()
	filesDir := http.Dir(filepath.Join(workDir, frontDistFolder))
	FileServer(r, "/", ToRedirectToIndexFS(filesDir))

	db.AutoMigrate(&api.User{})
	db.AutoMigrate(&api.Discussion{})
	db.AutoMigrate(&api.DBMessage{})

	r.Route("/api", func(r chi.Router) {
		r.Route("/login", func(r chi.Router) {
			r.Post("/", api.Login(db, []byte(jwtKey)))
		})

		r.Route("/users", func(r chi.Router) {
			r.Get("/", api.GetAllUsers(db))
			r.Get("/{id}", api.GetUser(db))
			r.Post("/", api.CreateUser(db))
		})
		r.Route("/discussions", func(r chi.Router) {
			r.Use(middleware.TokenAuth(db, []byte(jwtKey)))
			r.Get("/", api.GetAllDiscussions(db))
			r.Get("/{id}", api.GetDiscussion(db))
			r.Delete("/{id}", api.DeleteDiscussion(db))
			r.Post("/", api.CreateDiscussion(db))
			r.Put("/{id}", api.UpdateDiscussion(db))
			r.Get("/{id}/messages", api.GetAllMessages(db))
			r.Get("/messages/{id}", api.GetMessage(db))
			r.Post("/{id}/messages", api.CreateMessage(db))
			r.Delete("/messages/{id}", api.DeleteMessage(db))
		})
	})
	err = http.ListenAndServe(":"+port, r)

	if err != nil {
		panic("failed to listen" + err.Error())
	}

}
