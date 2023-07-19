package main

import (
	"log"
	"math"
	"strconv"
	"strings"

	"github.com/jmoiron/sqlx"
)

func AI(db *sqlx.DB, lobbyID string, x, y int, angle, speed float64) (int, int, float64, float64) {
	var x1, y1 int
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
	curTileID := (224 - (x/96+y/96)*15)
	curTileIDI := (curTileID+1)%15 + 1
	curTileIDJ := (curTileID+1)/15 + 1
	var botsMap [15][15]string
	for i, tileID := range strings.Split(mapData.MapKey, " ") {
		botsMap[(i)%15][(i)/15] = tileID
	}

	log.Println(botsMap, botsMap[curTileIDI][curTileIDJ])
	nextTileI, nextTileJ := getNextTile(botsMap, speed, angle, x, y, curTileIDI, curTileIDJ)
	nextNextTileI, nextNextTileJ := getNextTile(botsMap, speed, angle, x, y, nextTileI, nextTileJ)
	corners := "6 7 8 9 13 14 15 16 19 20 21 22 23 24 25 26"
	if strings.Contains(corners, botsMap[nextNextTileI][nextNextTileJ]) {
		if ((int((angle)*180/math.Pi)%360)-360 < -45) && ((int((angle)*180/math.Pi) % 360) > 45) {
			if strings.Contains("7 14 20 24", botsMap[nextNextTileI][nextNextTileJ]) {
				x1, y1, speed, angle = turnRight(x, y, speed, angle)
			} else {
				x1, y1, speed, angle = turnLeft(x, y, speed, angle)
			}
		} else if ((int((angle)*180/math.Pi) % 360) > 45) && ((int((angle)*180/math.Pi) % 360) > 135) {
			if strings.Contains("8 15 21 25", botsMap[nextNextTileI][nextNextTileJ]) {
				x1, y1, speed, angle = turnRight(x, y, speed, angle)
			} else {
				x1, y1, speed, angle = turnLeft(x, y, speed, angle)
			}
		} else if ((int((angle)*180/math.Pi) % 360) > 135) && ((int((angle)*180/math.Pi) % 360) > 225) {
			if strings.Contains("9 16 22 26", botsMap[nextNextTileI][nextNextTileJ]) {
				x1, y1, speed, angle = turnRight(x, y, speed, angle)
			} else {
				x1, y1, speed, angle = turnLeft(x, y, speed, angle)
			}
		} else {
			if strings.Contains("6 13 19 23", botsMap[nextNextTileI][nextNextTileJ]) {
				x1, y1, speed, angle = turnRight(x, y, speed, angle)
			} else {
				x1, y1, speed, angle = turnLeft(x, y, speed, angle)
			}
		}
	} else {
		moveStright(x, y, speed, angle)
	}
	return x1, y1, speed, angle
}

func getNextTile(botsMap [15][15]string, angle, speed float64, x, y, i, j int) (int, int) {

	xSpeed := math.Sin(angle) * speed
	ySpeed := math.Cos(angle) * speed
	curTileID := (224 - (x/96+y/96)*15)
	i1 := (curTileID+1)%15 + 1
	j1 := (curTileID+1)/15 + 1
	for (i1 == i) && (j1 == j) {
		log.Println(x, y)
		x += int(xSpeed)
		y += int(ySpeed)
		curTileID = (224 - (x/96+y/96)*15)
		i1 = (curTileID+1)%15 + 1
		j1 = (curTileID+1)/15 + 1
	}
	return i1, j1
}

func turnRight(x, y int, speed, angle float64) (int, int, float64, float64) {
	newSpeed := speed - 0.1
	newAngle := angle + 0.05
	xSpeed := math.Sin(angle) * newSpeed
	ySpeed := math.Cos(angle) * newSpeed
	x1 := x + int(xSpeed)
	y1 := y + int(ySpeed)
	return x1, y1, newSpeed, newAngle
}

func moveStright(x, y int, speed, angle float64) (int, int, float64) {
	var newSpeed float64
	if speed+0.1 < 8 {
		newSpeed = speed + 0.1
	} else {
		newSpeed = 8.
	}
	xSpeed := math.Sin(angle) * newSpeed
	ySpeed := math.Cos(angle) * newSpeed
	x1 := x + int(xSpeed)
	y1 := y + int(ySpeed)
	return x1, y1, newSpeed
}

func turnLeft(x, y int, speed, angle float64) (int, int, float64, float64) {
	newSpeed := speed - 0.1
	newAngle := angle - 0.05
	xSpeed := math.Sin(angle) * newSpeed
	ySpeed := math.Cos(angle) * newSpeed
	x1 := x + int(xSpeed)
	y1 := y + int(ySpeed)
	return x1, y1, newSpeed, newAngle
}
