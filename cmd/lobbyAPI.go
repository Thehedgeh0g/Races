package main

import (
	"encoding/json"
	"fmt"
	"io"
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

		var users []UserData
		var IDs []string

		lobby, err := getLobbyData(db, strconv.Itoa(lobbyID))
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		IDs = append(IDs, lobby.HostID, lobby.Player2ID, lobby.Player3ID, lobby.Player3ID)
		var user UserData

		var myId string
		for i, element := range IDs {

			if element != "0" {
				user, err = getUser(db, element)
				if err != nil {
					http.Error(w, "Server Error", 500)
					log.Println(err.Error())
					return
				}
				lvl, err := strconv.Atoi(user.Lvl)
				if err != nil {
					log.Println(err)
					return
				}
				if element == userIdstr {
					myId = strconv.Itoa(i)
				}
				user.Lvl = strconv.Itoa(lvl / 100)

			} else {
				user.ImgPath = "../static/sprites/plug.png"
				user.Nickname = "Empty"
				user.Lvl = "0"
				user.Id = "0"
			}

			users = append(users, user)
		}

		response := struct {
			Players []UserData `json:"User"`
			Id      string
		}{
			Players: users,
			Id:      myId,
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
func chooseMap(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		userIDstr, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		userID, err := strconv.Atoi(userIDstr)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		lobbyId, err := getLobbyID(db, userID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		var settings LobbySettings

		err = json.Unmarshal(reqData, &settings)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}
		fmt.Printf("settings: %v\n", settings)

		err = setLobbySettings(db, settings.MapID, settings.Rounds, strconv.Itoa(lobbyId), settings.HP, settings.Collision)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error(), "tut")
			return
		}

		response := struct {
			LobbyID string `json:"lobbyId"`
		}{
			LobbyID: strconv.Itoa(lobbyId),
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

func sendLobbyID(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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

		response := struct {
			LobbyID string `json:"MapKey"`
		}{
			LobbyID: strconv.Itoa(lobbyID),
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

func sendKey(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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
		lobby, err := getLobbyData(db, strconv.Itoa(lobbyID))
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err)
			return
		}

		mapData, err := getMapData(db, lobby.MapID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err)
			return
		}

		mapKey := mapData.MapKey

		var inSessionId string
		var cars, nicknames []string
		IDs := []string{lobby.HostID, lobby.Player2ID, lobby.Player4ID, lobby.Player4ID}

		for i, id := range IDs {
			if id != "0" {
				if userIdstr == id {
					inSessionId = strconv.Itoa(i)
				}
				user, err := getUser(db, id)
				if err != nil {
					http.Error(w, "Error", 500)
					log.Println(err.Error())
					return
				}
				if id == "10" {
					addAI(db, strconv.Itoa(lobbyID))
				} else if id == "12" {
					addAI(db, strconv.Itoa(lobbyID))
				} else if id == "13" {
					addAI(db, strconv.Itoa(lobbyID))
				}
				nicknames = append(nicknames, user.Nickname)
				cars = append(cars, user.Cars)
			}

		}

		response := struct {
			Rounds      string   `json:"Rounds"`
			MapKey      string   `json:"MapKey"`
			Cars        []string `json:"Cars"`
			Nicknames   []string `json:"Nicknames"`
			InSessionId string   `json:"InSessionId"`
			Hp          bool     `json:"hp"`
			Collision   bool     `json:"collision"`
		}{
			Rounds:      lobby.Laps,
			MapKey:      mapKey,
			Cars:        cars,
			Nicknames:   nicknames,
			InSessionId: inSessionId,
			Hp:          lobby.InfiniteHP,
			Collision:   lobby.CollisionOFF,
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

func createLobby(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		hostId, err := getUserID(db, r)
		log.Println(hostId, "host")
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		lobbyId := generateLobbyId()

		err = insert(db, lobbyId, hostId, "0", "0", "0", false)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		ID, err := strconv.Atoi(lobbyId)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		err = UPDATE(db, hostId, ID)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		createGroup(lobbyId)

		response := struct {
			LobbyID string `json:"lobbyId"`
		}{
			LobbyID: lobbyId,
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

func createBossLobby(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		hostId, err := getUserID(db, r)
		log.Println(hostId, "host")
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		lobbyId := generateLobbyId()

		user, err := getUser(db, hostId)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		var botID string
		countOfBosses, err := strconv.Atoi(user.Bosses)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}
		fmt.Printf("countOfBosses: %v\n", countOfBosses)
		if countOfBosses < 10 {
			botID = "10"
		} else if countOfBosses < 20 {
			botID = "12"
		} else {
			botID = "13"
		}
		fmt.Printf("botID: %v\n", botID)
		err = insert(db, lobbyId, hostId, botID, "0", "0", true)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		ID, err := strconv.Atoi(lobbyId)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		err = UPDATE(db, hostId, ID)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		createGroup(lobbyId)

		response := struct {
			LobbyID string `json:"lobbyId"`
		}{
			LobbyID: lobbyId,
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

func joinLobby(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		userID, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		var lobbyID string

		err = json.Unmarshal(reqData, &lobbyID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		err = setUsersLobby(db, lobbyID, userID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		lobby, err := getLobbyData(db, lobbyID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		var Error string

		if lobby.Boss {
			Error = "This lobby for single player"
		} else if lobby.Player2ID == "0" {
			err = addUserIntoLobby(db, "2", lobbyID, userID)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error())
				return
			}
		} else if lobby.Player3ID == "0" {
			err = addUserIntoLobby(db, "2", lobbyID, userID)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error())
				return
			}
		} else if lobby.Player4ID == "0" {
			err = addUserIntoLobby(db, "2", lobbyID, userID)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error())
				return
			}
		} else {
			Error = "This lobby is full"

		}
		response := struct {
			Error string `json:"error"`
		}{
			Error: Error,
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

func hostCheck(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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

		lobby, err := getLobbyData(db, strconv.Itoa(lobbyID))
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		var isHost bool
		if lobby.HostID == userIdstr {
			isHost = true
		} else {
			isHost = false
		}

		response := struct {
			Host bool `json:"Host"`
		}{
			Host: isHost,
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

func getFriendsLobbys(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		user, err := getUser(db, userID)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		fmt.Printf("user.Friends: %v\n", user.Friends)

		lobbyList, err := getLobbyList(db, strings.Split(user.Friends, " "))
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		response := struct {
			List []LobbyList `json:"LobbyList"`
		}{
			List: lobbyList,
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
