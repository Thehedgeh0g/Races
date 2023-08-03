package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/jmoiron/sqlx"
)

var connMutex sync.Mutex

var connections = make(map[*websocket.Conn]string)
var groups = make(map[string][]*websocket.Conn)
var races = make(map[string]string)
var bots = make(map[string]Bot)

func handleWebSocket(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		upgrader := websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		}

		cookie, err := r.Cookie("authCookieName")
		if err != nil {
			log.Println(err)
			return
		}
		r.Header.Add("Cookie", cookie.String())

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		userIDstr, err := getUserID(db, r)
		if err != nil {
			log.Println(err)
			return
		}

		userID, err := strconv.Atoi(userIDstr)
		if err != nil {
			log.Println(err)
			return
		}
		lobbyID, err := getLobbyID(db, userID)
		if err != nil {
			log.Println(err)
			return
		}

		clientID := strconv.Itoa(lobbyID) + " " + generateClientID()

		connections[conn] = clientID

		handleMessages(db, conn, clientID, lobbyID)

		err = conn.Close()
		if err != nil {
			log.Println(err)
			return
		}

	}
}

func handleMessages(db *sqlx.DB, conn *websocket.Conn, clientID string, lobbyID int) {
	var message string
	for {
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println(err)
			delete(connections, conn)
			removeConnectionFromGroups(db, conn)
			return
		}

		group := determineGroup(clientID, strconv.Itoa(lobbyID))
		addToGroup(conn, group)

		if strings.Split(message, " ")[1] == "race" {
			message = verificatePos(db, message, group)
		}
		connMutex.Lock()
		sendMessageToGroup(db, message, group)
		connMutex.Unlock()
	}
}

func getTable(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		var req string

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		tableStrings := strings.Split(races[req][1:], " ")
		sequence, err := getSequence(tableStrings)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

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
		IDs, err := getIDs(db, req)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		lobby, err := getLobbyData(db, req)
		if errorProcessor(err, w) {
			return
		}
		var results ResultsTable
		fmt.Printf("races[req]: %v\n", races[req])
		results, err = processResults(db, results, sequence, tableStrings, IDs, userID, lobby.Boss)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		response := struct {
			Response ResultsTable `json:"response"`
		}{
			Response: results,
		}

		jsonResponse, err := json.Marshal(response)
		if errorProcessor(err, w) {
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)
		deleteUserFromSession(db, user)
		clearCurLobbyId(db, user.Id)
		deleteSession(db, req)
	}
}
