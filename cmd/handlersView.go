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
	if errorProcessor(err, w) {
		return
	}

	err = ts.Execute(w, nil)
	if errorProcessor(err, w) {
		return
	}
}

func menu(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/menu.html")
	if errorProcessor(err, w) {
		return
	}

	err = ts.Execute(w, nil)
	if errorProcessor(err, w) {
		return
	}
}

func garageHandler(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/garage.html")
	if errorProcessor(err, w) {
		return
	}

	err = ts.Execute(w, nil)
	if errorProcessor(err, w) {
		return
	}
}
func lobbyHandler(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		lobbyIDstr := mux.Vars(r)["lobbyID"]

		ts, err := template.ParseFiles("pages/lobbycreation.html")
		if errorProcessor(err, w) {
			return
		}

		mapsData, err := mapPreview(db)
		if errorProcessor(err, w) {
			return
		}

		data := CreationPage{
			Token: lobbyIDstr,
			Maps:  mapsData,
		}

		err = ts.Execute(w, data)
		if errorProcessor(err, w) {
			return
		}
	}
}

func bossLobbyHandler(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		ts, err := template.ParseFiles("pages/bossLobby.html")
		if errorProcessor(err, w) {
			return
		}

		mapsData, err := mapPreview(db)
		if errorProcessor(err, w) {
			return
		}

		data := CreationPage{
			Maps: mapsData,
		}

		err = ts.Execute(w, data)
		if errorProcessor(err, w) {
			return
		}
	}
}
func gameAreaHandler(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		lobbyIDstr := mux.Vars(r)["lobbyID"]

		lobbyID, err := strconv.Atoi(lobbyIDstr)
		if errorProcessor(err, w) {
			return
		}

		lobby, err := getLobbyData(db, strconv.Itoa(lobbyID))
		if errorProcessor(err, w) {
			return
		}

		ts, err := template.ParseFiles("pages/location_1_1.html")
		if errorProcessor(err, w) {
			return
		}

		mapData, err := getMapData(db, lobby.MapID)
		if errorProcessor(err, w) {
			return
		}

		var cells [225]CellsData

		pathes := strings.Split(mapData.MapKey, " ")

		for i, element := range pathes {
			id, err := strconv.Atoi(element)
			if errorProcessor(err, w) {
				return
			}

			sprite, err := getSprite(db, id)
			if errorProcessor(err, w) {
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
		if errorProcessor(err, w) {
			return
		}
	}
}

func accountHandler(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ts, err := template.ParseFiles("pages/account.html")
		if errorProcessor(err, w) {
			return
		}
		userID, err := getUserID(db, r)
		if errorProcessor(err, w) {
			return
		}

		user, err := getUser(db, userID)
		if errorProcessor(err, w) {
			return
		}

		friendList, err := getFriends(db, userID)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		achivments, err := getAchivments(db, userID)
		if errorProcessor(err, w) {
			return
		}

		lvl, _ := strconv.Atoi(user.Lvl)
		user.Lvl = strconv.Itoa(lvl / 100)
		data := Account{
			ImgPath:    user.ImgPath,
			Nickname:   user.Nickname,
			Lvl:        user.Lvl,
			Bosses:     user.Bosses,
			Friends:    friendList,
			Achivments: achivments,
		}

		err = ts.Execute(w, data)
		if errorProcessor(err, w) {
			return
		}
	}
}

func handleReg(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/registration.html")
	if errorProcessor(err, w) {
		return
	}

	err = ts.Execute(w, nil)
	if errorProcessor(err, w) {
		return
	}
}

func handleconstruct(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/constructor.html")
	if errorProcessor(err, w) {
		return
	}

	err = ts.Execute(w, nil)
	if errorProcessor(err, w) {
		return
	}
}
