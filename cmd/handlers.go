package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
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
	Lobby []LobbyData
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

type LobbyData struct {
	ImgPath  string `db:"avatar"`
	Nickname string `db:"nickname"`
	Level    string `db:"exp"`
	Host     bool
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

func lobbyCreation(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		lobbyIDstr := mux.Vars(r)["lobbyID"]

		lobbyID, err := strconv.Atoi(lobbyIDstr)
		if err != nil {
			http.Error(w, "Invalid order id", http.StatusForbidden)
			log.Println(err)
			return
		}

		players, err := lobbyByID(db, lobbyID)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Order not found", 404)
				log.Println(err)
				return
			}

			http.Error(w, "Server Error", 500)
			log.Println(err)
			return
		}

		LobbyData, err := lobbyData(db, players)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		ts, err := template.ParseFiles("pages/lobbycreation.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		data := CreationPage{
			Lobby: LobbyData,
		}

		err = ts.Execute(w, data)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}

func gameArea(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ts, err := template.ParseFiles("pages/location_1_1.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		mapData, err := getMapData(db, 1)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err)
			return
		}

		var cells [225]CellsData

		a := strings.Split(mapData.MapKey, " ")

		for i, element := range a {
			id, err := strconv.Atoi(element)
			if err != nil {
				http.Error(w, "hehehe", 500)
				log.Println(err)
				return
			}
			sprite, err := getSprite(db, id+1)

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

func lobbyByID(db *sqlx.DB, lobbyID int) ([]string, error) {
	const query = `
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

	row := db.QueryRow(query, lobbyID)

	var id1, id2, id3, id4 string
	var sessions []string

	err := row.Scan(&id1, &id2, &id3, &id4)
	if err != nil {
		return nil, err
	}

	sessions = append(sessions, id1, id2, id3, id4)

	return sessions, nil
}

func lobbyData(db *sqlx.DB, players []string) ([]LobbyData, error) {

	query := `
		SELECT 
		  avatar, 
		  nickname, 
		  exp 
		FROM 
		  users 
		WHERE 
		  user_id = ?
		`

	var user LobbyData
	var users []LobbyData

	for _, element := range players {
		if element != "0" {
			row := db.QueryRow(query, element)
			err := row.Scan(&user.ImgPath, &user.Nickname, &user.Level)
			if err != nil {
				return nil, err
			}
			users = append(users, user)
		}

	}

	return users, nil
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
		http.Get("/lobby/" + lobbyId)

		w.WriteHeader(http.StatusOK)
	}
}

func joinLobby(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		const query = `
			UPDATE
			  brainless_races.users
			SET
			  curLobby_id = ?
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

		var req string

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		db.Exec(query, req, userId)

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

		log.Println(req.Email, ' ', req.Password)
		user, err := getUser(db, req)
		//log.Println(user.Email, ' ', user.Password)

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
