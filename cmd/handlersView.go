package main

import (
	"html/template"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

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

func garageHandler(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/garage.html")
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
func lobbyHandler(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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
func gameAreaHandler(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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

func accountHandler(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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

func handleReg(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/registration.html")
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

func handleconstruct(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/constructor.html")
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
