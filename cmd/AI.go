package main

import (
	"log"
	"strconv"
	"strings"

	"github.com/jmoiron/sqlx"
)

func AI(db *sqlx.DB, lobbyID string, x, y int) {
	sessionID, err := strconv.Atoi(lobbyID)
	if err != nil {
		log.Println(err)
	}
	mapID, _, err := getMapID(db, sessionID)
	mapData, err := getMapData(db, mapID)
	curTileID := (224 - (x/96+y/96)*15)
	var botsMap [][]string
	for i, tileID := range strings.Split(mapData.MapKey, " ") {
		botsMap[(i+1)%15-1][(i+1)/15-1] = tileID
	}
	log.Println(mapData.MapKey[curTileID])
}
