package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/jmoiron/sqlx"
)

func sendPlayers(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userIdstr, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}
		userID, err := strconv.Atoi(userIdstr)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		lobbyID, err := getLobbyID(db, userID)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		query := `
			SELECT
			  host_id,
			  player2_id,
			  player3_id,
			  player4_id
			FROM
			  brainless_races.sessions
			WHERE
			  session_id = ?   
		`
		var players []Player
		var IDs []string

		var UserId1, UserId2, UserId3, UserId4 string
		row := db.QueryRow(query, lobbyID)
		err = row.Scan(&UserId1, &UserId2, &UserId3, &UserId4)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		IDs = append(IDs, UserId1, UserId2, UserId3, UserId4)
		var player Player

		for _, element := range IDs {
			query = `
				SELECT
				  avatar,
				  nickname,
				  exp 
				FROM
				  users
				WHERE
				  user_id = ?    
			`

			if element != "0" {
				row := db.QueryRow(query, element)
				err := row.Scan(&player.ImgPath, &player.Nickname, &player.Level)
				if err != nil {
					http.Error(w, "Server Error", 500)
					log.Println(err.Error())
					return
				}
				lvl, err := strconv.Atoi(player.Level)
				if err != nil {
					log.Println(err)
					return
				}
				player.Level = strconv.Itoa(lvl / 100)

			} else {
				player.ImgPath = "../static/sprites/plug.png"
				player.Nickname = "Empty"
				player.Level = "0"
			}

			players = append(players, player)
		}

		response := struct {
			Players []Player `json:"User"`
		}{
			Players: players,
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

func getPreview(db *sqlx.DB, mapID int) ([]PreviewData, error) {

	mapData, err := getMapData(db, mapID)
	if err != nil {
		log.Println(err)
	}

	var cells []PreviewData
	var cell PreviewData

	cellArr := strings.Split(mapData.MapKey, " ")

	for _, element := range cellArr {
		id, err := strconv.Atoi(element)
		if err != nil {
			log.Println(err)
		}
		sprite, err := getSprite(db, id)

		if err != nil {
			log.Println(err)
		}

		cell.CellPath = sprite.SpritePath
		cells = append(cells, cell)
	}
	return cells, nil
}
