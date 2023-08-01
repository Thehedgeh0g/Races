package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/jmoiron/sqlx"
)

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

			if userID == friendReq.RecieverID {
				inFriends = true
			} else {
				for _, id := range strings.Split(user.Friends, " ") {
					if id == friendReq.RecieverID {
						inFriends = true
						break
					}
				}
			}

			if (!inFriends) && checkRequests(db, friendReq.RecieverID, userID) {
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
			IsFound   bool   `json:"IsFound"`
			FriendsID string `json:"FriendsID"`
		}{
			IsFound:   isFound,
			FriendsID: friendReq.RecieverID,
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

func sendOtherUser(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		var SenderID string

		err = json.Unmarshal(reqData, &SenderID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		sender, err := getUser(db, SenderID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		response := struct {
			Sender UserData `json:"Sender"`
		}{
			Sender: sender,
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
func deleteFriend(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		var friendsNick string

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

		err = json.Unmarshal(reqData, &friendsNick)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error(), "tut")
			return
		}

		friendsID, err := getUserByNick(db, friendsNick)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error(), "tut")
			return
		}

		err = deleteFromFriendList(db, user.ID, friendsID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error(), "tut")
			return
		}

		err = deleteFromFriendList(db, friendsID, user.ID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error(), "tut")
			return
		}

	}
}

func sendFriends(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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
			return
		}

		freinds := strings.Split(user.Friends[2:], " ")

		response := struct {
			Friends []string `json:"Friends"`
		}{
			Friends: freinds,
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
