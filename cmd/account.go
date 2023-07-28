package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/jmoiron/sqlx"
)

func getFriends(db *sqlx.DB, playerID string) ([]*FriendsData, error) {
	var query = `
		SELECT
		  friends
		FROM
		  users
		WHERE
		  user_id = ?    
	`

	row := db.QueryRow(query, playerID)
	var IDstr string
	err := row.Scan(&IDstr)
	if err != nil {
		log.Println(err.Error(), "tut")
		return nil, err
	}

	IDs := strings.Split(IDstr, " ")

	var nicks []*FriendsData
	for _, id := range IDs {
		if id != "0" {
			var nick FriendsData
			query = `
			SELECT
			  nickname
			FROM
			  users
			WHERE
			  user_id = ?    
		`

			row := db.QueryRow(query, id)
			err = row.Scan(&nick.Nickname)

			if err != nil {
				log.Println(err.Error())
				return nil, err
			}

			nicks = append(nicks, &nick)
			log.Println(nicks)
		}

	}

	return nicks, nil

}

func addFriend(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		var req FriendRequest

		userID, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error(), "tut")
			return
		}

		isFound := false

		friendID, err := getUserByNick(db, req)
		if err != nil {
			isFound = false
		} else {
			isFound = true

			var query = `
				SELECT
				  friends
				FROM
				  users
				WHERE
				  user_id = ?    
			`

			row := db.QueryRow(query, userID)
			var IDstr string
			err := row.Scan(&IDstr)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error())
				isFound = false
			}

			inFriends := false

			for _, id := range strings.Split(IDstr, " ") {
				if id == friendID {
					inFriends = true
				}
			}

			if userID == friendID {
				inFriends = true
			}

			if !inFriends {
				IDstr += " " + friendID

				stmt := `UPDATE users SET friends = ? WHERE user_id = ?`

				_, err = db.Exec(stmt, IDstr, userID)
				if err != nil {
					http.Error(w, "Error", 500)
					log.Println(err)
					isFound = false
				}

			} else {
				isFound = false
			}

		}
		response := struct {
			IsFound bool `json:"IsFound"`
		}{
			IsFound: isFound,
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
