package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"

	//"math"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/jmoiron/sqlx"
)

type UserRequest struct {
	Email    string `json:"Email"`
	Password string `json:"Password"`
}

type Userdata struct {
	UserId   string
	Email    string
	Password string
}

type CreationPage struct {
	Token string
	Maps  []MapsData
}

type MapsData struct {
	MapID      string `db:"sprite_id"`
	MapPreview []PreviewData
}

type PreviewData struct {
	CellPath string `db:"sprite_path"`
}

type GameMap struct {
	GameArea [225]CellsData
}

type CellsData struct {
	CellInfo string
}

type SpriteData struct {
	SpriteId   string `db:"sprite_id"`
	SpritePath string `db:"sprite_path"`
}

type MapData struct {
	MapKey string `db:"map_data"`
}

type Player struct {
	ImgPath  string `db:"avatar"`
	Nickname string `db:"nickname"`
	Level    string `db:"exp"`
}

var connections = make(map[*websocket.Conn]string)
var groups = make(map[string][]*websocket.Conn)

func handleWebSocket(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		upgrader := websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		//log.Println(conn)
		if err != nil {
			log.Println(err)
			return
		}

		userIDstr, err := getUserID(db, r)
		if err != nil {
			log.Println(err)
			return
		}
		log.Println("tut")
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
		log.Println("tut 2")
		connections[conn] = clientID
		log.Println("tut 3")
		handleMessages(conn, clientID, lobbyID)
		log.Println("tut 4")
		err = conn.Close()
		if err != nil {
			log.Println(err)
			return
		}

	}
}

func handleMessages(conn *websocket.Conn, clientID string, lobbyID int) {
	log.Println("tut 5")
	var message string
	for {
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println(err)
			delete(connections, conn)
			removeConnectionFromGroups(conn)
			return
		}
		message = "reboot"
		log.Printf("Received message from client %s: %s", clientID, message)

		// Определение группы клиента
		group := determineGroup(clientID, strconv.Itoa(lobbyID))
		addToGroup(conn, group)
		// Отправка сообщения только определенной группе клиентов
		sendMessageToGroup(message, group)
	}
}
func sendMessageToGroup(message, group string) {
	log.Println(groups)
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
	// Реализуйте определение группы клиента на основе его идентификатора
	// В данном примере используется простое условие
	log.Println(strings.Split(clientID, " ")[0])
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
	}
}

func createGroup(groupName string) {
	groups[groupName] = []*websocket.Conn{}
}

func generateClientID() string {
	// Реализуйте генерацию уникального идентификатора для клиента
	// В данном примере используется временная метка
	return time.Now().Format("20060102150405")
}

// func handleRaceSocket(w http.ResponseWriter, r *http.Request) {

// 	upgrader := websocket.Upgrader{
// 		ReadBufferSize:  1024,
// 		WriteBufferSize: 1024,
// 		CheckOrigin: func(r *http.Request) bool {
// 			return true
// 		},
// 	}

// 	conn, err := upgrader.Upgrade(w, r, nil)
// 	//log.Println(conn)
// 	if err != nil {
// 		log.Println("Ошибка при обновлении соединения WebSocket:", err)
// 		return
// 	}

// 	clients[conn] = true

// 	for {
// 		var posMessage string
// 		err := conn.ReadJSON(&posMessage)
// 		log.Println(posMessage)
// 		if err != nil {
// 			log.Println("Ошибка чтения JSON:", err)
// 			//delete(clients, conn) // Удаляем клиента из списка при ошибке чтения
// 			break
// 		}

// 		raceBroadcast <- posMessage
// 	}

// 	conn.Close()

// }

// func verificatePos() {
// 	for {

// 		// posMessage = "speed angle y0 x0 y1 x1 id"
// 		//

// 		// Получаем сообщение из канала broadcast
// 		posMessage := <-raceBroadcast
// 		speed := strings.Split(posMessage, " ")[1]
// 		angle := strings.Split(posMessage, " ")[2]
// 		V, err := strconv.Atoi(speed)
// 		if err != nil {
// 			log.Println(err)
// 		}

// 		deg, err := strconv.Atoi(angle)
// 		if err != nil {
// 			log.Println(err)
// 		}

// 		y0 := strings.Split(posMessage, " ")[3]
// 		yOld, err := strconv.Atoi(y0)
// 		if err != nil {
// 			log.Println(err)
// 		}

// 		x0 := strings.Split(posMessage, " ")[4]
// 		xOld, err := strconv.Atoi(x0)
// 		if err != nil {
// 			log.Println(err)
// 		}

// 		y1 := strings.Split(posMessage, " ")[5]
// 		yNew, err := strconv.Atoi(y1)
// 		if err != nil {
// 			log.Println(err)
// 		}

// 		x1 := strings.Split(posMessage, " ")[6]
// 		xNew, err := strconv.Atoi(x1)
// 		if err != nil {
// 			log.Println(err)
// 		}

// 		inSessionId := strings.Split(posMessage, " ")[7]

// 		xSpeed := math.Sin(float64(deg)) * float64(V)
// 		ySpeed := math.Cos(float64(deg)) * float64(V)
// 		if (float64(xOld)+xSpeed == float64(xNew)) && (float64(yOld)+ySpeed == float64(yNew)) {
// 			posMessage = y1 + " " + x1 + " " + angle + " " + inSessionId
// 		}
// 		// Отправляем сообщение всем подключенным клиентам
// 		for client := range clients {
// 			err := client.WriteJSON(posMessage)
// 			if err != nil {
// 				log.Println("Ошибка записи JSON:", err)
// 				client.Close()
// 				delete(clients, client) // Удаляем клиента из списка при ошибке записи
// 			}
// 		}
// 	}
// }

func login(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/login.html")
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}

	err = ts.Execute(w, nil)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}
}

func menu(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/menu.html")
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}

	err = ts.Execute(w, nil)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}
}

func lobbyCreation(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		lobbyIDstr := mux.Vars(r)["lobbyID"]

		ts, err := template.ParseFiles("pages/lobbycreation.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		mapsData, err := mapPreview(db)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		data := CreationPage{
			Token: lobbyIDstr,
			Maps:  mapsData,
		}

		err = ts.Execute(w, data)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}

func mapPreview(db *sqlx.DB) ([]MapsData, error) {
	query := `
	SELECT
	  map_id
  	FROM
	  maps   
  	`
	var IDs []string
	err := db.Select(&IDs, query)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	var data []MapsData

	for _, element := range IDs {
		id, err := strconv.Atoi(element)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		preview, err := getPreview(db, id)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		mapData := MapsData{
			MapID:      element,
			MapPreview: preview,
		}
		data = append(data, mapData)
	}
	return data, nil
}

func hostCheck(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userIdstr, err := getUserID(db, r)
		//log.Println(userId, "host")
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
			  host_id
			FROM
			  brainless_races.sessions
			WHERE
			  session_id = ?   
		`

		var hostID string
		row := db.QueryRow(query, lobbyID)
		err = row.Scan(&hostID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}
		//log.Println(UserId1, UserId2, UserId3, UserId4)
		var isHost bool
		if hostID == userIdstr {
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

func sendPlayers(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userIdstr, err := getUserID(db, r)
		//log.Println(userId, "host")
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
		//log.Println(query, lobbyID)

		var UserId1, UserId2, UserId3, UserId4 string
		row := db.QueryRow(query, lobbyID)
		err = row.Scan(&UserId1, &UserId2, &UserId3, &UserId4)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}
		//log.Println(UserId1, UserId2, UserId3, UserId4)
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

				//log.Println(player.Level)
			} else {
				player.ImgPath = "../static/sprites/ava.png"
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
	//log.Println(mapData)
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

func gameArea(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		lobbyIDstr := mux.Vars(r)["lobbyID"]

		lobbyID, err := strconv.Atoi(lobbyIDstr)
		if err != nil {
			http.Error(w, "Invalid order id", http.StatusForbidden)
			log.Println(err)
			return
		}

		mapID, err := getMapID(db, lobbyID)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		ts, err := template.ParseFiles("pages/location_1_1.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		mapData, err := getMapData(db, mapID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err)
			return
		}

		var cells [225]CellsData

		pathes := strings.Split(mapData.MapKey, " ")

		for i, element := range pathes {
			id, err := strconv.Atoi(element)
			if err != nil {
				http.Error(w, "hehehe", 500)
				log.Println(err)
				return
			}
			sprite, err := getSprite(db, id)

			if err != nil {
				http.Error(w, "hehe", 500)
				log.Println(err)
				return
			}

			newTile := CellsData{
				CellInfo: sprite.SpritePath,
			}

			cells[i] = newTile
		}

		data := GameMap{
			GameArea: cells,
		}

		err = ts.Execute(w, data)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}
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

		var mapID string

		err = json.Unmarshal(reqData, &mapID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		log.Println(mapID)

		query := `
			UPDATE
			  brainless_races.sessions
			SET
			  map_id = ?
			WHERE
			  session_id = ?    
		`
		_, err = db.Exec(query, mapID, lobbyId)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
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
		//log.Println(userId, "host")
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
		//log.Println(userId, "host")
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

		mapID, err := getMapID(db, lobbyID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err)
			return
		}

		mapData, err := getMapData(db, mapID)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err)
			return
		}

		mapKey := mapData.MapKey

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

		//log.Println(query, lobbyID)

		var UserId1, UserId2, UserId3, UserId4 string
		row := db.QueryRow(query, lobbyID)
		err = row.Scan(&UserId1, &UserId2, &UserId3, &UserId4)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}
		//log.Println(UserId1, UserId2, UserId3, UserId4)
		var inSessionId, car, nickname string
		var cars, nicknames []string
		IDs := []string{UserId1, UserId2, UserId3, UserId4}

		for i, id := range IDs {
			if id != "0" {
				if userIdstr == id {
					inSessionId = strconv.Itoa(i)
				}
				query = `
					SELECT
					  nickname,
					  cars
					FROM
					  users
					WHERE
					  user_id = ?    
				`

				row = db.QueryRow(query, id)
				err = row.Scan(&nickname, &car)
				if err != nil {
					http.Error(w, "Error", 500)
					log.Println(err.Error())
					return
				}
				nicknames = append(nicknames, nickname)
				cars = append(cars, car)
			}

		}

		response := struct {
			MapKey      string   `json:"MapKey"`
			Cars        []string `json:"Cars"`
			Nicknames   []string `json:"Nicknames"`
			InSessionId string   `json:"InSessionId"`
		}{
			MapKey:      mapKey,
			Cars:        cars,
			Nicknames:   nicknames,
			InSessionId: inSessionId,
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

func getLobbyID(db *sqlx.DB, userID int) (int, error) {
	const query = `SELECT
	  currLobby_id
	FROM
	  users
	WHERE
	  user_id = ?    
	`

	row := db.QueryRow(query, userID)
	var ID int
	err := row.Scan(&ID)
	if err != nil {
		return 0, err
	}

	return ID, nil
}

func getMapID(db *sqlx.DB, lobbyID int) (int, error) {
	const query = `SELECT
	  map_id
	FROM
	  sessions
	WHERE
	session_id = ?    
	`

	row := db.QueryRow(query, lobbyID)
	var IDstr string
	err := row.Scan(&IDstr)
	if err != nil {
		return 0, err
	}

	ID, err := strconv.Atoi(IDstr)
	if err != nil {
		return 0, err
	}

	return ID, nil
}

func getSprite(db *sqlx.DB, spriteId int) (*SpriteData, error) {
	const query = `SELECT
	  sprite_path
	FROM
	  sprites
	WHERE
	  sprite_id = ?    
	`

	row := db.QueryRow(query, spriteId)

	newSprite := new(SpriteData)
	err := row.Scan(&newSprite.SpritePath)
	if err != nil {
		return nil, err
	}

	return newSprite, err
}

func getMapData(db *sqlx.DB, mapId int) (*MapData, error) {
	query := "SELECT map_data FROM maps WHERE map_id = ?"
	row := db.QueryRow(query, mapId)
	key := new(MapData)
	err := row.Scan(&key.MapKey)

	if err != nil {
		return nil, err
	}
	return key, nil
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
		log.Println(lobbyId)
		_, err = insert(db, lobbyId, hostId, "0", "0", "0")
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

		_, err = UPDATE(db, hostId, ID)
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
		query := `
			UPDATE
			  brainless_races.users
			SET
			  currLobby_id = ?
			WHERE
			  user_id = ?    
		`
		userId, err := getUserID(db, r)
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

		var lobbyId string

		err = json.Unmarshal(reqData, &lobbyId)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		_, err = db.Exec(query, lobbyId, userId)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		query = `SELECT
			  player2_id,
			  player3_id,
			  player4_id
	  		FROM
			  sessions
	  		WHERE
	  		  session_id = ?    
	  	`

		ID, err := strconv.Atoi(lobbyId)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		var UserId2, UserId3, UserId4 string
		row := db.QueryRow(query, ID)
		//log.Println(row)
		err = row.Scan(&UserId2, &UserId3, &UserId4)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}
		//log.Println(UserId2, UserId3, UserId4)
		updated := false
		if (UserId2 == "0") && !updated {
			updated = true
			_, err = db.Exec("UPDATE sessions SET player2_id = ? WHERE session_id = ?", userId, lobbyId)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error())
				return
			}
		} else if (UserId3 == "0") && !updated {
			updated = true
			_, err = db.Exec("UPDATE sessions SET player3_id = ? WHERE session_id = ?", userId, lobbyId)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error())
				return
			}
		} else if (UserId4 == "0") && !updated {
			updated = true
			_, err = db.Exec("UPDATE sessions SET player4_id = ? WHERE session_id = ?", userId, lobbyId)
			if err != nil {
				http.Error(w, "Error", 500)
				log.Println(err.Error())
				return
			}
		} else {
			Error := "This lobby is full"

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
		log.Println(updated)
	}
}

func insert(db *sqlx.DB, lobby_id, hostId, player1_id, player2_id, player3_id string) (int, error) {
	stmt := `INSERT INTO sessions (session_id, host_id, player2_id, player3_id, player4_id)
    VALUES(?, ?, ?, ?, ?)`

	result, err := db.Exec(stmt, lobby_id, hostId, player1_id, player2_id, player3_id)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func UPDATE(db *sqlx.DB, userID string, lobbyID int) (int, error) {
	stmt := `UPDATE users SET currLobby_id = ? WHERE user_id = ?`

	result, err := db.Exec(stmt, lobbyID, userID)
	if err != nil {
		log.Println("tut")
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func generateLobbyId() string {
	CreationTime := time.Now()
	id := strconv.FormatInt(int64(CreationTime.Hour()*10000+CreationTime.Second()+CreationTime.Minute()*100), 10)
	return id
}

func getUserID(db *sqlx.DB, r *http.Request) (string, error) {
	cookie, err := r.Cookie("authCookieName")
	if err != nil {
		if err == http.ErrNoCookie {
			return "", err
		}
		return "", err
	}

	userIDStr := cookie.Value

	err = search(db, userIDStr)
	if err != nil {
		return "", err
	}

	return userIDStr, nil
}

func searchUser(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		var req UserRequest

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		log.Println(req.Email, req.Password)
		user, err := getUser(db, req)
		log.Println(user.Email, ' ', user.Password)

		if err != nil {
			http.Error(w, "Incorect email or password", 500)
			log.Println("Incorect email or password")
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:    "authCookieName",
			Value:   fmt.Sprint(user.UserId),
			Path:    "/",
			Expires: time.Now().AddDate(0, 0, 1),
		})

		log.Println("Cookie setted")
	}
}

func AuthByCookie(db *sqlx.DB, w http.ResponseWriter, r *http.Request) error {
	cookie, err := r.Cookie("authCookieName")

	if err != nil {
		if err == http.ErrNoCookie {
			http.Error(w, "No auth cookie passed", 400)
			log.Println(err)
			return err
		}
		http.Error(w, "Internal Server Error", 500)
		log.Println(err)
		return err
	}

	userIDStr := cookie.Value

	err = search(db, userIDStr)
	log.Println(err)
	if err != nil {
		return err
	}

	return nil
}

func getUser(db *sqlx.DB, req UserRequest) (*Userdata, error) {
	const query = `
	SELECT
	  user_id,
	  email,
	  password
  	FROM
	  users
  	WHERE
	  email = ? AND
	  password = ?
	`
	row := db.QueryRow(query, req.Email, req.Password)
	user := new(Userdata)
	err := row.Scan(&user.UserId, &user.Email, &user.Password)
	log.Println(user)
	if err != nil {
		return nil, err
	}
	log.Println(user.UserId)
	return user, nil
}

func search(db *sqlx.DB, UserID string) error {
	const query = `
	SELECT
	  user_id,
	  email,
	  password
	FROM
	  users
	WHERE
	  user_id = ?
	`

	row := db.QueryRow(query, UserID)
	user := new(Userdata)
	err := row.Scan(&user.UserId, &user.Email, &user.Password)
	//fmt.Println(user, UserID)
	if err != nil {
		fmt.Println("fdf")
		return err
	}

	//fmt.Println(UserID)
	return nil
}

func deleteUser(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Name:    "authCookieName",
			Path:    "/",
			Expires: time.Now().AddDate(0, 0, -1),
		})

		return
	}
}
