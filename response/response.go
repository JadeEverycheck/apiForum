package response

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func Json(w http.ResponseWriter, status int, payload interface{}) {
	data, err := json.MarshalIndent(payload, "", "")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	fmt.Fprintln(w, string(data))
}

func Ok(w http.ResponseWriter, payload interface{}) {
	Json(w, http.StatusOK, payload)
}

func Created(w http.ResponseWriter, payload interface{}) {
	Json(w, http.StatusCreated, payload)
}

func Deleted(w http.ResponseWriter) {
	Json(w, http.StatusNoContent, nil)
}

func NotFound(w http.ResponseWriter) {
	Json(w, http.StatusNotFound, "Entity not found")
}

func BadRequest(w http.ResponseWriter, message string) {
	Json(w, http.StatusBadRequest, message)
}

func ServerError(w http.ResponseWriter, message string) {
	Json(w, http.StatusInternalServerError, message)
}
