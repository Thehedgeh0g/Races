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
