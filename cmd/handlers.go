package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"

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
	Lobby []*LobbyData
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
		LobbyData, err := lobbyData(db, 1)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err)
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

func lobbyData(db *sqlx.DB, lobby_id int) ([]*LobbyData, error) {

	query := "	SELECT avatar, nickname, exp FROM users WHERE currLobby_id = " + strconv.Itoa(lobby_id)

	var user []*LobbyData

	err := db.Select(&user, query)
	if err != nil {
		return nil, err
	}

	fmt.Println(user)

	return user, nil
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
			http.Error(w, "Incorect email or password", 401)
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
			http.Error(w, "No auth cookie passed", 401)
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
	  post_id,
	  email,
	  password
	FROM
	  users
	WHERE
	  post_id = ?
	`

	row := db.QueryRow(query, UserID)
	user := new(Userdata)
	err := row.Scan(&user.UserId, &user.Email, &user.Password)
	fmt.Println(user, UserID)
	if err != nil {
		fmt.Println("fdf")
		return err
	}

	fmt.Println(UserID)
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
