package main

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/jmoiron/sqlx"
)

func sendSprites(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		sprites, err := getSprites(db)
		if errorProcessor(err, w) {
			return
		}

		response := struct {
			Sprites []string `json:"Sprites"`
		}{
			Sprites: sprites,
		}

		jsonResponse, err := json.Marshal(response)
		if errorProcessor(err, w) {
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
		if errorProcessor(err, w) {
			return
		}

		var key string

		err = json.Unmarshal(reqData, &key)
		if errorProcessor(err, w) {
			return
		}

		err = saveMap(db, key)
		if errorProcessor(err, w) {
			return
		}
	}
}
