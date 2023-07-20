package main

import (
	"encoding/json"
	"io"
	"log"
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
var bots = make(map[string][3]Bot)

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
			message = verificatePos(message)
		} else if strings.Split(message, " ")[1] == "botrace" {
			message = verificatePosBots(db, message)
			log.Println(message)
		}
		connMutex.Lock()
		sendMessageToGroup(db, message, group)
		connMutex.Unlock()
	}
}
func sendMessageToGroup(db *sqlx.DB, message, group string) {
	for _, conn := range groups[group] {

		err := conn.WriteJSON(message)
		if err != nil {
			log.Println(err)
			delete(connections, conn)
			removeConnectionFromGroups(db, conn)
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

func removeConnectionFromGroups(db *sqlx.DB, conn *websocket.Conn) {
	delete(connections, conn)

	for group, conns := range groups {
		for i, c := range conns {
			if c == conn {
				groups[group] = append(conns[:i], conns[i+1:]...)
				break
			}
		}
		deleteGroup(db, group)
	}

}

func deleteGroup(db *sqlx.DB, groupID string) {
	if groups[groupID] == nil {
		delete(groups, groupID)
		deleteSession(db, groupID)
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

	isFinished := strings.Split(posMessage, " ")[10]

	hp := strings.Split(posMessage, " ")[9]

	speed := strings.Split(posMessage, " ")[2]

	angle := strings.Split(posMessage, " ")[3]

	y1 := strings.Split(posMessage, " ")[6]

	x1 := strings.Split(posMessage, " ")[7]

	sessionID := strings.Split(posMessage, " ")[0]

	inSessionId := strings.Split(posMessage, " ")[8]
	if (strings.Split(isFinished, "/")[0] == "1") && !(strings.Contains(races[sessionID], inSessionId+"/")) {
		races[sessionID] = races[sessionID] + " " + inSessionId + "/" + strings.Split(isFinished, "/")[1]
	} else if (strings.Split(isFinished, "/")[0] == "2") && !(strings.Contains(races[sessionID], inSessionId+"/")) {
		races[sessionID] = races[sessionID] + " " + inSessionId + "/" + "N|F"
	}

	posMessage = y1 + " " + x1 + " " + angle + " " + speed + " " + hp + " " + inSessionId + races[sessionID]

	return posMessage

}

func verificatePosBots(db *sqlx.DB, posMessage string) string {

	isFinished := strings.Split(posMessage, " ")[9]

	speed := strings.Split(posMessage, " ")[2]

	angle := strings.Split(posMessage, " ")[3]

	y1 := strings.Split(posMessage, " ")[6]

	x1 := strings.Split(posMessage, " ")[7]

	sessionID := strings.Split(posMessage, " ")[0]

	bot1 := bots[strings.Split(posMessage, " ")[0]][0]
	bot1.x = 200
	bot1.y = 430
	bot1.angle = 1.5
	//bot1.x, bot1.y, bot1.speed, bot1.angle = AI(db, strings.Split(posMessage, " ")[0], bot1.x, bot1.y, bot1.angle, bot1.speed)

	botMessage := y1 + " " + x1 + " " + angle + " " + speed + " " + "1"
	log.Println(botMessage)
	sendMessageToGroup(db, botMessage, strings.Split(posMessage, " ")[0])
	inSessionId := strings.Split(posMessage, " ")[8]
	if (strings.Split(isFinished, "/")[0] == "1") && !(strings.Contains(races[sessionID], inSessionId+"/")) {
		races[sessionID] = races[sessionID] + " " + inSessionId + "/" + strings.Split(isFinished, "/")[1]
	}

	posMessage = y1 + " " + x1 + " " + angle + " " + speed + " " + inSessionId + races[sessionID]

	return posMessage

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

		IDs, err := getIDs(db, req)
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
	const query = `
		SELECT
		  money,
		  exp
		FROM
		  users
		WHERE
		  user_id = ?    
	`
	var moneyStr, expStr string
	row := db.QueryRow(query, userID)
	err := row.Scan(&moneyStr, &expStr)
	if err != nil {
		return err
	}

	money, err := strconv.Atoi(moneyStr)
	if err != nil {
		return err
	}

	exp, err := strconv.Atoi(expStr)
	if err != nil {
		return err
	}

	stmt := `UPDATE users SET money = ?, exp = ? WHERE user_id = ?`

	_, err = db.Exec(stmt, strconv.Itoa(15*modificator+money), strconv.Itoa(13*modificator+exp), userID)
	if err != nil {
		log.Println("tuta")
		return err
	}
	return nil
}

func getIDs(db *sqlx.DB, sessionID string) ([4]string, error) {
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

	row := db.QueryRow(query, sessionID)
	err := row.Scan(&IDs[0], &IDs[1], &IDs[2], &IDs[3])
	if err != nil {
		log.Println(err.Error(), "tutb")
		return IDs, err
	}
	return IDs, nil
}

func getSequence(tableStrings []string) ([]int, error) {
	var sequence []int
	for _, playerResults := range tableStrings {
		CID, err := strconv.Atoi(strings.Split(playerResults, "/")[0])
		if err != nil {
			log.Println(err.Error())
			return sequence, err
		}
		sequence = append(sequence, CID)
	}
	return sequence, nil
}

func deleteSession(db *sqlx.DB, lobbyID string) error {
	stmt := `DELETE FROM brainless_races.sessions WHERE session_id = ?`

	_, err := db.Exec(stmt, lobbyID)
	if err != nil {
		log.Println(err.Error())
		return err
	}
	return nil
}
