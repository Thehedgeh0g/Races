package main

import (
	"log"
	"math"
	"strconv"
	"strings"

	"github.com/jmoiron/sqlx"
)

var tile string

func AI(db *sqlx.DB, lobbyID string, x, y, angle, speed float64) (float64, float64, float64, float64) {
	x1, y1 := x, y
	mapData := setMapKey(db, lobbyID)
	curTileID := (int(y)/96)*15 + (int(x) / 96)
	curTileIDI := (curTileID) / 15
	curTileIDJ := (curTileID) % 15
	var botsMap [15][15]string
	for i, tileID := range strings.Split(mapData.MapKey, " ") {
		botsMap[(i)/15][(i)%15] = tileID
	}

	//log.Println(botsMap[curTileIDI])
	//corners := "6 7 8 9 13 14 15 16 19 20 21 22 23 24 25 26"
	grass := "/1/2/3/4/"
	roads := "/10/11/17/18/27/28/29/30/6/7/8/9/13/14/15/16/19/20/21/22/23/24/25/26/34/"
	nextTileI, nextTileJ := getNextTile(botsMap, speed, angle, x, y, curTileIDI, curTileIDJ)

	if tile != botsMap[curTileIDI][curTileIDJ] {
		//log.Println(x, y)
		log.Println(botsMap[curTileIDI-1][curTileIDJ-1], botsMap[curTileIDI-1][curTileIDJ], botsMap[curTileIDI-1][curTileIDJ+1])
		log.Println(botsMap[curTileIDI][curTileIDJ-1], botsMap[curTileIDI][curTileIDJ], botsMap[curTileIDI][curTileIDJ+1])
		log.Println(botsMap[curTileIDI+1][curTileIDJ-1], botsMap[curTileIDI+1][curTileIDJ], botsMap[curTileIDI+1][curTileIDJ+1])
		log.Println(botsMap[curTileIDI][curTileIDJ], botsMap[nextTileI][nextTileJ])
		tile = botsMap[curTileIDI][curTileIDJ]
	}
	if strings.Contains(grass, "/"+botsMap[nextTileI][nextTileJ]+"/") {
		if ((int((angle)*180/math.Pi) % 360) >= 45) && ((int((angle)*180/math.Pi) % 360) < 135) {
			if (((getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads)) - (int((angle)*180/math.Pi) % 360)) < 0) || goDown(botsMap, curTileIDI, curTileIDJ, roads) {
				x1, y1, speed, angle = turnRight(x, y, speed, angle)
				log.Println("turn right1", getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads), ((getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads)) - (int((angle)*180/math.Pi) % 360)), goDown(botsMap, curTileIDI, curTileIDJ, roads))
			} else if ((getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads)) - (int((angle)*180/math.Pi) % 360)) > 0 {
				x1, y1, speed, angle = turnLeft(x, y, speed, angle)
				log.Println("turn left", getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads))
			}
		} else if ((int((angle)*180/math.Pi)%360)-360 >= -45) && ((int((angle)*180/math.Pi) % 360) < 45) {
			if (((getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads)) - (int((angle)*180/math.Pi) % 360)) > 0) || goLeft(botsMap, curTileIDI, curTileIDJ, roads) {
				x1, y1, speed, angle = turnRight(x, y, speed, angle)
				log.Println("turn right2", getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads))
			} else {
				x1, y1, speed, angle = turnLeft(x, y, speed, angle)
				log.Println("turn left", getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads))
			}
		} else if ((int((angle)*180/math.Pi)%360)-360 >= 225) && ((int((angle)*180/math.Pi) % 360) < 315) {
			if ((getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads) - int((angle)*180/math.Pi)%360) < 0) || goUp(botsMap, curTileIDI, curTileIDJ, roads) {
				x1, y1, speed, angle = turnRight(x, y, speed, angle)
				log.Println("turn right3", getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads))
			} else {
				x1, y1, speed, angle = turnLeft(x, y, speed, angle)
				log.Println("turn left", getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads))
			}
		} else if ((int((angle)*180/math.Pi) % 360) >= 135) && ((int((angle)*180/math.Pi)%360)+360 < 225) {
			if ((getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads) - int((angle)*180/math.Pi)%360) < 0) || goRight(botsMap, curTileIDI, curTileIDJ, roads) {
				x1, y1, speed, angle = turnRight(x, y, speed, angle)
				log.Println("turn right4", getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads))
			} else {
				x1, y1, speed, angle = turnLeft(x, y, speed, angle)
				log.Println("turn left", getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads))
			}
		}
	} else {
		x1, y1, speed, angle = moveStright(x, y, speed, angle)
		//log.Println(int((angle)*180/math.Pi)%360, curTileIDI, curTileIDJ, x1, y1)

	}
	//log.Println((getRoadAngle(botsMap, curTileIDI, curTileIDJ, roads)) - (int((angle)*180/math.Pi) % 360))
	return x1, y1, angle, speed
}

func goDown(botsMap [15][15]string, curTileIDI, curTileIDJ int, roads string) bool {
	if (strings.Contains(roads, "/"+botsMap[curTileIDI][curTileIDJ-1]+"/") ||
		strings.Contains(roads, "/"+botsMap[curTileIDI][curTileIDJ+1]+"/")) &&
		strings.Contains(roads, "/"+botsMap[curTileIDI+1][curTileIDJ]+"/") {
		return true
	}
	return false
}

func goLeft(botsMap [15][15]string, curTileIDI, curTileIDJ int, roads string) bool {
	if (strings.Contains(roads, "/"+botsMap[curTileIDI-1][curTileIDJ]+"/") ||
		strings.Contains(roads, "/"+botsMap[curTileIDI+1][curTileIDJ]+"/")) &&
		strings.Contains(roads, "/"+botsMap[curTileIDI][curTileIDJ-1]+"/") {
		return true
	}
	return false
}

func goUp(botsMap [15][15]string, curTileIDI, curTileIDJ int, roads string) bool {
	if (strings.Contains(roads, "/"+botsMap[curTileIDI][curTileIDJ-1]+"/") ||
		strings.Contains(roads, "/"+botsMap[curTileIDI][curTileIDJ+1]+"/")) &&
		strings.Contains(roads, "/"+botsMap[curTileIDI-1][curTileIDJ]+"/") {
		return true
	}
	return false
}

func goRight(botsMap [15][15]string, curTileIDI, curTileIDJ int, roads string) bool {
	if (strings.Contains(roads, "/"+botsMap[curTileIDI-1][curTileIDJ]+"/") ||
		strings.Contains(roads, "/"+botsMap[curTileIDI+1][curTileIDJ]+"/")) &&
		strings.Contains(roads, "/"+botsMap[curTileIDI][curTileIDJ+1]+"/") {
		return true
	}
	return false
}

func getRoadAngle(botsMap [15][15]string, curTileIDI, curTileIDJ int, roads string) int {
	if strings.Contains(roads, "/"+botsMap[curTileIDI][curTileIDJ-1]+"/") || strings.Contains(roads, "/"+botsMap[curTileIDI][curTileIDJ+1]+"/") {
		return 90
	} else {
		return 180
	}
}

func getNextTile(botsMap [15][15]string, speed, angle, x, y float64, i, j int) (int, int) {

	xSpeed := math.Sin(angle)
	ySpeed := math.Cos(angle)
	curTileID := (int(y)/96)*15 + (int(x) / 96)
	i1 := 0
	j1 := 0
	for {
		i1 = (curTileID) / 15
		j1 = (curTileID) % 15
		if (i != i1) || (j != j1) {
			break
		}
		x += xSpeed
		y += ySpeed
		curTileID = (int(y)/96)*15 + (int(x) / 96)
	}
	return i1, j1
}

func turnRight(x, y, speed, angle float64) (float64, float64, float64, float64) {
	var newSpeed float64
	if speed-0.01 < 0.4 {
		newSpeed = speed - 0.01
	} else {
		newSpeed = 0.3
	}

	newAngle := angle - 0.1
	xSpeed := math.Sin(angle) * newSpeed
	ySpeed := math.Cos(angle) * newSpeed
	x1 := x + xSpeed
	y1 := y + ySpeed
	return x1, y1, newSpeed, newAngle
}

func moveStright(x, y, speed, angle float64) (float64, float64, float64, float64) {
	var newSpeed float64
	if speed+0.01 > 1.3 {
		newSpeed = speed + 0.01
	} else {
		newSpeed = 1.3
	}
	xSpeed := math.Sin(angle) * newSpeed
	ySpeed := math.Cos(angle) * newSpeed
	x1 := x + xSpeed
	y1 := y + ySpeed
	//log.Println(speed, newSpeed)
	return x1, y1, newSpeed, angle
}

func turnLeft(x, y, speed, angle float64) (float64, float64, float64, float64) {
	var newSpeed float64
	if speed-0.01 < 0.3 {
		newSpeed = speed - 0.01
	} else {
		newSpeed = 0.3
	}
	newAngle := angle + 0.1
	xSpeed := math.Sin(angle) * newSpeed
	ySpeed := math.Cos(angle) * newSpeed
	x1 := x + xSpeed
	y1 := y + ySpeed
	return x1, y1, newSpeed, newAngle
}

func findStart(tiles string, id string) (float64, float64) {
	startIndex := 1
	for i, key := range strings.Split(tiles, " ") {
		if key == "37" {
			startIndex = i
		}
	}
	startY := startIndex / 15 * 96
	startX := startIndex % 15 * 96
	startX += 50
	inSessionId, err := strconv.Atoi(id)
	if err != nil {
		log.Println(err)
	}
	startY = startY + 5 + 17/2 + 23*inSessionId
	log.Println(startX, startY)
	return float64(startX), float64(startY)
}

func addAI(db *sqlx.DB, lobbyID string) {
	const query = `
		SELECT
		  player2_id,
		  player3_id,
		  player4_id
		FROM
		  sessions
		WHERE    
		  session_id = ?
	`
	var id1, id2, id3 string
	row := db.QueryRow(query, lobbyID)
	err := row.Scan(&id1, &id2, &id3)
	if err != nil {
		log.Println(err)
	}
	if id1 == "0" {
		var bot Bot
		bot.x, bot.y = findStart(setMapKey(db, lobbyID).MapKey, "1")
		bot.angle = math.Pi / 2
		bot.inSessionId = "1"
		bot.hp = 100
		bot.speed = 0
		bots[lobbyID] = append(bots[lobbyID], bot)
	}
	if id2 == "0" {
		var bot Bot
		bot.x, bot.y = findStart(setMapKey(db, lobbyID).MapKey, "2")
		bot.angle = math.Pi / 2
		bot.inSessionId = "2"
		bot.hp = 100
		bot.speed = 0.01
		bots[lobbyID] = append(bots[lobbyID], bot)
	}
	if id3 == "0" {
		var bot Bot
		bot.x, bot.y = findStart(setMapKey(db, lobbyID).MapKey, "3")
		bot.angle = math.Pi / 2
		bot.inSessionId = "3"
		bot.hp = 100
		bot.speed = 0.02
		bots[lobbyID] = append(bots[lobbyID], bot)
	}
}

func setMapKey(db *sqlx.DB, lobbyID string) MapData {
	sessionID, err := strconv.Atoi(lobbyID)
	if err != nil {
		log.Println(err)
	}
	mapID, _, err := getMapID(db, sessionID)
	if err != nil {
		log.Println(err)
	}
	mapData, err := getMapData(db, mapID)
	if err != nil {
		log.Println(err)
	}
	return *mapData
}
