package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"math"
	"sync"

	//"math"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/jmoiron/sqlx"
)

type LobbySettings struct {
	MapID  string `json:"MapID"`
	Rounds string `json:"Rounds"`
}

type UserRequest struct {
	Email    string `json:"Email"`
	Password string `json:"Password"`
}

type FriendRequest struct {
	Nick string `json:"Nick"`
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

type AccountPlayer struct {
	ImgPath  string `db:"avatar"`
	Nickname string `db:"nickname"`
	Lvl      string `db:"exp"`
	Bosses   string ` db:"boss_count"`
}

type AccountData struct {
	ImgPath  string `db:"avatar"`
	Nickname string `db:"nickname"`
	Lvl      string `db:"exp"`
	Bosses   string ` db:"boss_count"`
	Friends  []*FriendsData
}

type FriendsData struct {
	Nickname string `db:"nickname"`
}

var connMutex sync.Mutex

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
}

func generateClientID() string {
	return time.Now().Format("20060102150405")
}

func verificatePos(posMessage string) string {
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

	inSessionId := strings.Split(posMessage, " ")[8]

	xSpeed := math.Sin(deg) * V
	ySpeed := math.Cos(deg) * V
	if ((xOld+xSpeed-1 <= xNew) || (xOld+xSpeed+1 >= xNew)) && ((yOld+ySpeed-1 <= yNew) || (yOld+ySpeed+1 >= yNew)) {
		posMessage = y1 + " " + x1 + " " + angle + " " + inSessionId
	}
	return posMessage

}

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

func accountData(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ts, err := template.ParseFiles("pages/account.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		playerID, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		player, err := getPlayerData(db, playerID)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		friendList, err := getFriends(db, playerID)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		data := AccountData{
			ImgPath:  player[0],
			Nickname: player[1],
			Lvl:      player[2],
			Bosses:   player[3],
			Friends:  friendList,
		}

		err = ts.Execute(w, data)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}

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
		log.Println(err.Error())
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
				log.Println(err.Error())
				return nil, err
			}

			nicks = append(nicks, &nick)
			log.Println(nicks)
		}

	}

	return nicks, nil

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

func gameArea(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		lobbyIDstr := mux.Vars(r)["lobbyID"]

		lobbyID, err := strconv.Atoi(lobbyIDstr)
		if err != nil {
			http.Error(w, "Invalid order id", http.StatusForbidden)
			log.Println(err)
			return
		}

		mapID, _, err := getMapID(db, lobbyID)
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

		var settings LobbySettings

		err = json.Unmarshal(reqData, &settings)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		query := `
			UPDATE
			  brainless_races.sessions
			SET
			  map_id = ?,
			  rounds = ?
			WHERE
			  session_id = ?    
		`

		_, err = db.Exec(query, settings.MapID, settings.Rounds, lobbyId)
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

		mapID, rounds, err := getMapID(db, lobbyID)
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

		var UserId1, UserId2, UserId3, UserId4 string

		row := db.QueryRow(query, lobbyID)
		err = row.Scan(&UserId1, &UserId2, &UserId3, &UserId4)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

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
			Rounds      string   `json:"Rounds"`
			MapKey      string   `json:"MapKey"`
			Cars        []string `json:"Cars"`
			Nicknames   []string `json:"Nicknames"`
			InSessionId string   `json:"InSessionId"`
		}{
			Rounds:      rounds,
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

func getMapID(db *sqlx.DB, lobbyID int) (int, string, error) {
	const query = `SELECT
	  map_id,
	  rounds
	FROM
	  sessions
	WHERE
	session_id = ?    
	`
	var IDstr, CountOfRounds string

	row := db.QueryRow(query, lobbyID)
	err := row.Scan(&IDstr, &CountOfRounds)
	if err != nil {
		return 0, "", err
	}

	ID, err := strconv.Atoi(IDstr)
	if err != nil {
		return 0, "", err
	}

	return ID, CountOfRounds, nil
}

func getSprite(db *sqlx.DB, spriteId int) (*SpriteData, error) {
	const query = `SELECT
	  sprite_path
	FROM
	  sprites
	WHERE
	  sprite_id = ?    
	`

	newSprite := new(SpriteData)

	row := db.QueryRow(query, spriteId)
	err := row.Scan(&newSprite.SpritePath)
	if err != nil {
		return nil, err
	}

	return newSprite, err
}

func getMapData(db *sqlx.DB, mapId int) (*MapData, error) {
	query := "SELECT map_data FROM maps WHERE map_id = ?"

	key := new(MapData)

	row := db.QueryRow(query, mapId)
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
		err = row.Scan(&UserId2, &UserId3, &UserId4)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

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

		user, err := getUser(db, req)

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

	user := new(Userdata)

	row := db.QueryRow(query, UserID)
	err := row.Scan(&user.UserId, &user.Email, &user.Password)
	if err != nil {
		return err
	}

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
