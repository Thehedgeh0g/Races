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

		var req AddFriendRequest
		var friendReq FriendRequest
		friendReq.Status = "0"

		userID, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		user, err := getUser(db, userID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		friendReq.SenderID = user.ID
		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error(), "tut")
			return
		}

		isFound := false
		friendReq.RecieverID, err = getUserByNick(db, req.Nick)
		if err != nil {
			isFound = false
		} else {
			isFound = true

			inFriends := false

			for _, id := range strings.Split(user.Friends, " ") {
				if id == friendReq.RecieverID {
					inFriends = true
				}
			}

			if userID == friendReq.RecieverID {
				inFriends = true
			}

			if !inFriends {
				err = createFriendsReq(db, friendReq)
				if err != nil {
					http.Error(w, "Error", 500)
					log.Println(err.Error())
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

func sendReqList(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		user, err := getUser(db, userID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		requests, err := getReqList(db, user.ID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		response := struct {
			Requests []FriendRequest `json:"Requests"`
		}{
			Requests: requests,
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

func answerReq(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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

		user, err := getUser(db, userID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error(), "tut")
			return
		}

		if req.Status == "1" {
			err = updateFriends(db, false, req)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error(), "tut")
				return
			}
			err = updateFriends(db, true, req)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error(), "tut")
				return
			}
		}

		err = deleteReq(db, user.ID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error(), "tut")
			return
		}

	}
}
