package main

import (
	"log"
	"net/http"
)

func errorProcessor(err error, w http.ResponseWriter) bool {
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return true
	}
	return false
}
