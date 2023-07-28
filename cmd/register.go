package main

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/jmoiron/sqlx"
)

func getNewUser(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		var newUser User

		err = json.Unmarshal(reqData, &newUser)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		fileData := newUser.Avatar[strings.IndexByte(newUser.Avatar, ',')+1:]
		//log.Println(newUser.Avatar)
		userImg, err := base64.StdEncoding.DecodeString(fileData)
		if err != nil {
			http.Error(w, "img", 500)
			log.Println(err.Error())
			return
		}

		fileName := "static/img/" + newUser.AvatarName

		fileUser, err := os.Create(fileName)
		if err != nil {
			http.Error(w, "img", 400)
			log.Println(err.Error(), "tut")
			return
		}

		_, err = fileUser.Write(userImg)

		if err != nil {
			http.Error(w, "img", 500)
			log.Println(err.Error())
			return
		}

		const stmt = `INSERT INTO users (email, password, Avatar, nickname, friends, achivments)
		VALUES(?, ?, ?, ?, ?, ?)`

		_, err = db.Exec(stmt, newUser.Email, newUser.Password, "../static/img/"+newUser.AvatarName, newUser.Nickname, "0", "/0/")

		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}
