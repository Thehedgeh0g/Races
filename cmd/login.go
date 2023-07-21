package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/jmoiron/sqlx"
)

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
		log.Println(req)
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
	log.Println(row)
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
			Value:   "",
			Expires: time.Unix(0, 0),
		})
	}
}
