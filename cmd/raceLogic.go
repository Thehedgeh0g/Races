package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jmoiron/sqlx"
)

var connMutex sync.Mutex

var connections = make(map[*websocket.Conn]string)
var groups = make(map[string][]*websocket.Conn)
var races = make(map[string]string)

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

		handleMessages(conn, clientID, lobbyID)

		err = conn.Close()
		if err != nil {
			log.Println(err)
			return
		}

	}
}

func handleMessages(conn *websocket.Conn, clientID string, lobbyID int) {
	var message string
	for {
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println(err)
			delete(connections, conn)
			removeConnectionFromGroups(conn)
			return
		}

		group := determineGroup(clientID, strconv.Itoa(lobbyID))
		addToGroup(conn, group)
		if strings.Split(message, " ")[1] == "race" {
			message = verificatePos(message)
		}
		connMutex.Lock()
		sendMessageToGroup(message, group)
		connMutex.Unlock()
	}
}
func sendMessageToGroup(message, group string) {
	for _, conn := range groups[group] {

		err := conn.WriteJSON(message)
		if err != nil {
			log.Println(err)
			delete(connections, conn)
			removeConnectionFromGroups(conn)
		}
	}
}

func addToGroup(conn *websocket.Conn, groupID string) {
	if !Contains(groups[groupID], conn) {
		groups[groupID] = append(groups[groupID], conn)
	}

}

func Contains(a []*websocket.Conn, x *websocket.Conn) bool {
	for _, n := range a {
		if x == n {
			return true
		}
	}
	return false
}

func determineGroup(clientID, groupID string) string {
	for group := range groups {
		if strings.Split(clientID, " ")[0] == group {

			return group
		} else {
			continue
		}
	}

	return ""
}

func removeConnectionFromGroups(conn *websocket.Conn) {
	delete(connections, conn)

	for group, conns := range groups {
		for i, c := range conns {
			if c == conn {
				groups[group] = append(conns[:i], conns[i+1:]...)
				break
			}
		}
		deleteGroup(group)
	}

}

func deleteGroup(groupID string) {
	if groups[groupID] == nil {
		delete(groups, groupID)
	}
}

func createGroup(groupName string) {
	groups[groupName] = []*websocket.Conn{}
	races[groupName] = ""
}

func generateClientID() string {
	return time.Now().Format("20060102150405")
}

func verificatePos(posMessage string) string {

	isFinished := strings.Split(posMessage, " ")[9]

	speed := strings.Split(posMessage, " ")[2]

	angle := strings.Split(posMessage, " ")[3]

	V, err := strconv.ParseFloat(speed, 64)
	if err != nil {
		log.Println(err)
	}

	deg, err := strconv.ParseFloat(angle, 64)
	if err != nil {
		log.Println(err)
	}

	y0 := strings.Split(posMessage, " ")[4]
	yOld, err := strconv.ParseFloat(y0, 64)
	if err != nil {
		log.Println(err)
	}

	x0 := strings.Split(posMessage, " ")[5]
	xOld, err := strconv.ParseFloat(x0, 64)
	if err != nil {
		log.Println(err)
	}

	y1 := strings.Split(posMessage, " ")[6]
	yNew, err := strconv.ParseFloat(y1, 64)
	if err != nil {
		log.Println(err)
	}

	x1 := strings.Split(posMessage, " ")[7]
	xNew, err := strconv.ParseFloat(x1, 64)
	if err != nil {
		log.Println(err)
	}

	sessionID := strings.Split(posMessage, " ")[0]

	inSessionId := strings.Split(posMessage, " ")[8]
	if (strings.Split(isFinished, "/")[0] == "1") && !(strings.Contains(races[sessionID], inSessionId+"/")) {
		races[sessionID] = races[sessionID] + " " + inSessionId + "/" + strings.Split(isFinished, "/")[1]
		log.Println(inSessionId, races[sessionID])
	} else if inSessionId == "0" {
		log.Println(inSessionId, strings.Contains(races[sessionID], inSessionId+"/"))
	}

	xSpeed := math.Sin(deg) * V
	ySpeed := math.Cos(deg) * V
	if ((xOld+xSpeed-1 <= xNew) || (xOld+xSpeed+1 >= xNew)) && ((yOld+ySpeed-1 <= yNew) || (yOld+ySpeed+1 >= yNew)) {
		posMessage = y1 + " " + x1 + " " + angle + " " + inSessionId + races[sessionID]
	} else {
		posMessage = y0 + " " + x0 + " " + angle + " " + inSessionId + races[sessionID]
	}
	//log.Println(races[sessiwonID])
	return posMessage

}

func getTable(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}
		fmt.Printf("reqData: %v\n", reqData)
		var req string

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		tableStrings := strings.Split(races[req][1:], " ")
		//log.Println(tableStrings)
		var sequence []int
		for _, playerResults := range tableStrings {
			CID, err := strconv.Atoi(strings.Split(playerResults, "/")[0])
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error())
				return
			}
			sequence = append(sequence, CID)
		}

		userID, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Error", 500)
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
			  sessions
			WHERE
			  session_id = ?   
		`

		var IDs [4]string

		row := db.QueryRow(query, req)
		err = row.Scan(&IDs[0], &IDs[1], &IDs[2], &IDs[3])
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		var results ResultsTable

		for place, inSessionId := range sequence {
			if inSessionId < 4 {
				if IDs[inSessionId] == userID {
					err := updateUserTable(db, userID, 4-place)
					if err != nil {
						http.Error(w, "Server Error", 500)
						log.Println(err.Error())
						return
					}

					results.Money = strconv.Itoa(15 * (4 - place))
					results.Exp = strconv.Itoa(13 * (4 - place))
				}
			}
		}

		response := struct {
			Response ResultsTable `json:"response"`
		}{
			Response: results,
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

func updateUserTable(db *sqlx.DB, userID string, modificator int) error {
	stmt := `UPDATE users SET money = ?, exp = ? WHERE user_id = ?`

	_, err := db.Exec(stmt, strconv.Itoa(15*modificator), strconv.Itoa(13*modificator), userID)
	if err != nil {
		return err
	}
	return nil
}
