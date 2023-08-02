package main

import (
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
)

func generateLobbyId() string {
	CreationTime := time.Now()
	id := strconv.FormatInt(int64(CreationTime.Hour()*10000+CreationTime.Second()+CreationTime.Minute()*100), 10)
	return id
}
func getPreview(db *sqlx.DB, mapID string) ([]PreviewData, error) {

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

func mapPreview(db *sqlx.DB) ([]MapsData, error) {
	IDs, err := getMapIDs(db)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	var data []MapsData

	for _, ID := range IDs {
		preview, err := getPreview(db, ID)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		mapData := MapsData{
			MapID:      ID,
			MapPreview: preview,
		}
		data = append(data, mapData)
	}
	return data, nil
}

func getLobbyList(db *sqlx.DB, friends []string) ([]LobbyList, error) {
	var list []LobbyList
    log.Println(`'`, friends, `'`)
	for _, ID := range friends {
		if ID != "0" {
			log.Println(ID)
			var listElement LobbyList
			friend, err := getUser(db, ID)
			if err != nil {
				return nil, err
			}
			log.Println(`'`, friend.CurLobbyID, `'`)
			if !checkLobby(db, friend.CurLobbyID) {
				listElement.Friend.Avatar = friend.ImgPath
				listElement.Friend.Nickname = friend.Nickname
				listElement.Friend.Lvl = friend.Lvl
				listElement.LobbyID = friend.CurLobbyID
				list = append(list, listElement)
				
				log.Println(`'`, list, `'`)
			}
		} else {
			continue
		}

	}
	return list, nil
}

func checkLobby(db *sqlx.DB, lobbyID string) bool {
	lobby, err := getLobbyData(db, lobbyID)
	if err != nil {
		return true
	}
	if lobby.LobbyID == "0"{
		return true
	}
	return lobby.InProgress
}
