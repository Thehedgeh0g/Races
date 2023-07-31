package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/jmoiron/sqlx"
)

func getFriends(db *sqlx.DB, userID string) ([]*FriendsData, error) {
	user, err := getUser(db, userID)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	IDs := strings.Split(user.Friends, " ")

	var nicks []*FriendsData
	for _, id := range IDs {
		if id != "0" {
			var nick FriendsData
			friend, err := getUser(db, id)
			if err != nil {
				log.Println(err.Error())
				return nil, err
			}

			nick.Nickname = friend.Nickname

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

			user, err := getUser(db, userID)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error())
				isFound = false
			}

			inFriends := false

			for _, id := range strings.Split(user.Friends, " ") {
				if id == friendID {
					inFriends = true
				}
			}

			if userID == friendID {
				inFriends = true
			}

			if !inFriends {
				user.Friends += " " + friendID

				stmt := `UPDATE users SET friends = ? WHERE user_id = ?`

				_, err = db.Exec(stmt, user.Friends, userID)
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

func getAchivments(db *sqlx.DB, userID string) ([]*AchivmentData, error) {
	user, err := getUser(db, userID)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	IDs := strings.Split(user.Achivments, "/")

	var achivments []*AchivmentData
	for _, id := range IDs {
		if (id != "0") && (id != "") {
			fmt.Printf("id: %v\n", id)
			achivment, err := getAchivment(db, id)
			if err != nil {
				log.Println(err.Error(), "tut")
				return nil, err
			}
			achivments = append(achivments, &achivment)
		}

	}

	return achivments, nil

}
