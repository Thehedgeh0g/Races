package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/jmoiron/sqlx"
)

var accountConnections = make(map[string]*websocket.Conn)

func handleAccountSocket(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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

		clientID := userIDstr

		accountConnections[clientID] = conn

		handleAccountMessages(db, conn, clientID)

		err = conn.Close()
		if err != nil {
			log.Println(err)
			return
		}

	}
}

func handleAccountMessages(db *sqlx.DB, conn *websocket.Conn, clientID string) {
	var message string
	for {
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println(err)
			delete(connections, conn)
			removeConnectionFromGroups(db, conn)
			return
		}
		log.Println(message)
		recieverID := strings.Split(message, " ")[0]
		if recieverID != "0" {
			connMutex.Lock()
			sendMessageToClient(db, message, recieverID)
			connMutex.Unlock()
		}

	}
}

func sendMessageToClient(db *sqlx.DB, message, recieverID string) {
	conn := accountConnections[recieverID]
	err := conn.WriteJSON(message)
	if err != nil {
		log.Println(err)
		delete(connections, conn)
	}

}
