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

		err = addUser(db, newUser)
		if err != nil {
			http.Error(w, "img", 500)
			log.Println(err.Error())
			return
		}
	}
}
