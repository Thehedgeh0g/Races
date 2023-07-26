package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/jmoiron/sqlx"
)

func getPlayerData(db *sqlx.DB, playerID string) ([4]string, error) {
	const query = `
		SELECT
		  avatar,
		  nickname,
		  exp,
		  boss_count 
		FROM
		  users
		WHERE
		  user_id = ?    
	`

	row := db.QueryRow(query, playerID)
	log.Println(playerID)
	var player [4]string
	err := row.Scan(&player[0], &player[1], &player[2], &player[3])
	log.Println(player)
	if err != nil {
		log.Println(err.Error())
		return player, err
	}

	lvl, err := strconv.Atoi(player[3])
	if err != nil {
		log.Println(err)
		return player, err
	}
	player[3] = strconv.Itoa(lvl / 100)

	return player, nil

}

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
				log.Println(err.Error(), "tutr")
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

func getUserByNick(db *sqlx.DB, req FriendRequest) (string, error) {
	const query = `
	SELECT
	  user_id
  	FROM
	  users
  	WHERE
	  nickname = ?
	`
	var ID string

	row := db.QueryRow(query, req.Nick)
	err := row.Scan(&ID)
	if err != nil {
		return "", err
	}

	return ID, nil
}
