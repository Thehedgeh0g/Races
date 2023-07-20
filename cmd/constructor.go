package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/jmoiron/sqlx"
)

func getSprites(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		const query = `
			SELECT
			  sprite_id
			  sprite_path
			FROM
			  sprites  
		`
		var sprites [][]string
		db.Select(sprites, query)

		response := struct {
			Sprites [][]string `json:"Sprites"`
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

		const stmt = `INSERT INTO maps (map_data)
		VALUES(?)`

		_, err = db.Exec(stmt, key)

		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

	}
}
