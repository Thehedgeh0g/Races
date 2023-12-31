package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/jmoiron/sqlx"
)

func sendAchivment(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		var achivmentID string

		err = json.Unmarshal(reqData, &achivmentID)
		if errorProcessor(err, w) {
			return
		}
		userID, err := getUserID(db, r)
		if errorProcessor(err, w) {
			return
		}
		user, err := getUser(db, userID)
		if errorProcessor(err, w) {
			return
		}
		var achivment AchivmentData

		if !checkAchivments(user, achivmentID) {
			achivment, err = getAchivment(db, achivmentID)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error())
				return
			}
			log.Println(achivment)
			err := updateAchivments(db, user, achivmentID)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error())
				return
			}
		}

		response := struct {
			Achivment AchivmentData `json:"achivment"`
		}{
			Achivment: achivment,
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
