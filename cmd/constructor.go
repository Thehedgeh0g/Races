package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/jmoiron/sqlx"
)

func sendSprites(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		sprites, err := getSprites(db)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		response := struct {
			Sprites []string `json:"Sprites"`
		}{
			Sprites: sprites,
		}

		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)

	}
}

func recordKey(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		var key string

		err = json.Unmarshal(reqData, &key)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		err = saveMap(db, key)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}
