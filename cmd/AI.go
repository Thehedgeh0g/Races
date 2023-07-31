package main

import (
	"log"
	"math"
	"strconv"
	"strings"

	"github.com/jmoiron/sqlx"
)

func AI(db *sqlx.DB, lobbyID string, bot Bot) Bot {
	bot.angle = math.Floor(bot.angle*10000) / 10000
	corners := "/6/7/8/9/13/14/15/16/19/20/21/22/23/24/25/26/"
	grass := "/1/2/3/4/"
	roads := "/10/11/17/18/27/28/29/30/6/7/8/9/13/14/15/16/19/20/21/22/23/24/25/26/34/32/31/33/"

	curTileIDI, curTileIDJ := getCurTile(int(bot.x), int(bot.y))
	var VisMat [3][3]string

	VisMat = createVision(bot.mapMatrix, curTileIDI, curTileIDJ)

	VisMat = posVision(bot.angle, VisMat)

	bot.visionMatrix = VisMat

	bot.checks = checkProcessing(VisMat[1][1], bot.checks)

	if VisMat[1][1] == "37" {
		if bot.angle < math.Pi/2 {
			bot.angle = math.Pi / 2
		}
		if bot.checks > 0 {
			bot.checks = 0
			bot.laps -= 1
			log.Println("lap completed", bot.laps)
		}
	}
	deviation := (math.Mod(math.Mod(bot.angle*180/math.Pi, 360)+360, 90))
	if deviation >= 45 {
		deviation = -(90 - deviation)
	}
	//deviation = math.Floor(deviation*100) / 100
	if math.Abs(deviation) < 3 {
		deviation = 0
		bot.angle = math.Round(bot.angle/(math.Pi/2)) * (math.Pi / 2)
	}
	if strings.Contains(corners, "/"+VisMat[1][2]+"/") || strings.Contains(corners, "/"+VisMat[1][1]+"/") {
		if bot.speed > 3.5 {
			bot.speed -= 0.07
		} else if bot.speed > 3.3 {
			bot.speed -= 0.04
		} else if bot.speed > 3.1 {
			bot.speed -= 0.005
		} else {

			bot.speed = bot.speed + 0.08
		}

	} else {
		if bot.speed+0.1 < 7.6 {
			bot.speed = bot.speed + 0.1
		} else {
			bot.speed = 7.6
		}
	}
	rspeed := 0.03 * math.Sqrt(bot.speed*1.6)
	if strings.Contains(grass, "/"+VisMat[1][2]+"/") {
		if strings.Contains(roads, "/"+VisMat[2][1]+"/") {
			bot = turnRight(bot, rspeed)
		} else if strings.Contains(roads, "/"+VisMat[0][1]+"/") {
			bot = turnLeft(bot, rspeed)
		}
	} else if deviation < -0.5 {
		bot = turnLeft(bot, rspeed)
	} else if deviation > 0.5 {
		bot = turnRight(bot, rspeed)
	} else {
		bot = moveStright(bot)
	}
	bot.visionMatrix = VisMat
	bot = correctPosDiv(bot)
	return bot
}

func correctPosDiv(bot Bot) Bot {
	if (math.Mod(bot.angle*180/math.Pi, 360)+360 >= 315) && (math.Mod(bot.angle*180/math.Pi, 360)+360 < 405) {
		inTilePosX := (int(bot.x) % 96)
		if inTilePosX > 60 {
			bot.x -= 1
		} else if inTilePosX < 36 {
			bot.x += 1
		}
		log.Println("vrx")
	} else if (math.Mod(bot.angle*180/math.Pi, 360)+360 >= 225) && (math.Mod(bot.angle*180/math.Pi, 360)+360 < 315) {
		inTilePosY := (int(bot.y) % 96)
		if inTilePosY > 60 {
			bot.y -= 1
		} else if inTilePosY < 36 {
			bot.y += 1
		}
		log.Println("vry")
	} else if ((math.Mod(bot.angle*180/math.Pi, 360)+360 >= 495) && (math.Mod(bot.angle*180/math.Pi, 360)+360 < 585)) ||
		((math.Mod(bot.angle*180/math.Pi, 360)+360 >= 135) && (math.Mod(bot.angle*180/math.Pi, 360)+360 < 225)) {
		inTilePosX := (int(bot.x) % 96)
		if inTilePosX > 60 {
			bot.x -= 1
		} else if inTilePosX < 36 {
			bot.x += 1
		}
		log.Println("vrxx")
	} else {
		inTilePosY := (int(bot.y) % 96)
		if inTilePosY > 60 {
			bot.y -= 1
		} else if inTilePosY < 36 {
			bot.y += 1
		}
		log.Println("vryy")
	}
	return bot
}

func checkProcessing(tileID string, cheksCol int) int {
	checkpoints := "/31/32/33/34/35/36/"
	if strings.Contains(checkpoints, tileID) {
		cheksCol += 1
	}
	return cheksCol
}

func collision(bot Bot, userX, userY int, userHp string) Bot {
	if userHp != bot.userHP {
		bot.hp -= 5
		bot.speed -= 0.3
		if bot.speed < 0.1 {
			bot.speed = 0.1
		}
		bot.userHP = userHp

		log.Println("damaged", bot.hp)
	}
	return bot
}

func posVision(angle float64, vision [3][3]string) [3][3]string {
	var VisMat [3][3]string
	if (math.Mod(angle*180/math.Pi, 360)+360 >= 315) && (math.Mod(angle*180/math.Pi, 360)+360 < 405) {

		VisMat = rotate(vision)
		vision = VisMat
		VisMat = rotate(vision)
		vision = VisMat
		VisMat = rotate(vision)
	} else if (math.Mod(angle*180/math.Pi, 360)+360 >= 225) && (math.Mod(angle*180/math.Pi, 360)+360 < 315) {

		VisMat = rotate(vision)
		vision = VisMat
		VisMat = rotate(vision)
	} else if ((math.Mod(angle*180/math.Pi, 360)+360 >= 495) && (math.Mod(angle*180/math.Pi, 360)+360 < 585)) ||
		((math.Mod(angle*180/math.Pi, 360)+360 >= 135) && (math.Mod(angle*180/math.Pi, 360)+360 < 225)) {

		VisMat = rotate(vision)
		vision = VisMat
	} else {
		VisMat = vision
	}
	return VisMat
}

func rotate(mat [3][3]string) [3][3]string {

	var rMat [3][3]string

	rMat[0][0] = mat[2][0]
	rMat[0][1] = mat[1][0]
	rMat[0][2] = mat[0][0]
	rMat[1][0] = mat[2][1]
	rMat[1][1] = mat[1][1]
	rMat[1][2] = mat[0][1]
	rMat[2][0] = mat[2][2]
	rMat[2][1] = mat[1][2]
	rMat[2][2] = mat[0][2]

	return rMat
}

func createVision(botsMap [15][15]string, curTileIDI, curTileIDJ int) [3][3]string {
	var botVision [3][3]string
	botVision[0][0] = botsMap[curTileIDI-1][curTileIDJ-1]
	botVision[0][1] = botsMap[curTileIDI-1][curTileIDJ]
	botVision[0][2] = botsMap[curTileIDI-1][curTileIDJ+1]
	botVision[1][0] = botsMap[curTileIDI][curTileIDJ-1]
	botVision[1][1] = botsMap[curTileIDI][curTileIDJ]
	botVision[1][2] = botsMap[curTileIDI][curTileIDJ+1]
	botVision[2][0] = botsMap[curTileIDI+1][curTileIDJ-1]
	botVision[2][1] = botsMap[curTileIDI+1][curTileIDJ]
	botVision[2][2] = botsMap[curTileIDI+1][curTileIDJ+1]
	return botVision
}

func turnRight(bot Bot, rspeed float64) Bot {
	bot.angle = bot.angle - rspeed
	xSpeed := math.Sin(bot.angle) * bot.speed
	ySpeed := math.Cos(bot.angle) * bot.speed
	bot.x = bot.x + xSpeed
	bot.y = bot.y + ySpeed
	return bot
}

func moveStright(bot Bot) Bot {
	xSpeed := math.Sin(bot.angle) * bot.speed
	ySpeed := math.Cos(bot.angle) * bot.speed
	bot.x = bot.x + xSpeed
	bot.y = bot.y + ySpeed
	//log.Println(speed, newSpeed)
	return bot
}

func turnLeft(bot Bot, rspeed float64) Bot {
	bot.angle = bot.angle + rspeed
	xSpeed := math.Sin(bot.angle) * bot.speed
	ySpeed := math.Cos(bot.angle) * bot.speed
	bot.x = bot.x + xSpeed
	bot.y = bot.y + ySpeed
	return bot
}

func createMapMatrix(db *sqlx.DB, lobbyID string) [15][15]string {
	mapData := setMapKey(db, lobbyID)
	var botsMap [15][15]string
	for i, tileID := range strings.Split(mapData.MapKey, " ") {
		botsMap[(i)/15][(i)%15] = tileID
	}
	return botsMap
}

func getCurTile(x, y int) (int, int) {

	curTileID := (int(y)/96)*15 + (int(x) / 96)
	curTileIDI := (curTileID) / 15
	curTileIDJ := (curTileID) % 15
	return curTileIDI, curTileIDJ
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

	lobby, err := getLobbyData(db, lobbyID)
	if err != nil {
		log.Println(err)
	}
	laps, _ := strconv.Atoi(lobby.Laps)
	var bot Bot
	bot.mapMatrix = createMapMatrix(db, lobbyID)
	bot.angle = math.Pi / 2
	bot.hp = 100
	bot.userHP = "100"
	bot.speed = 0
	bot.laps = laps
	if lobby.Player2ID == "10" {

		bot.x, bot.y = findStart(setMapKey(db, lobbyID).MapKey, "1")

		bot.inSessionId = "1"
	}
	curTileI, curTileJ := getCurTile(int(bot.x), int(bot.y))
	bot.visionMatrix = createVision(bot.mapMatrix, curTileI, curTileJ)

	bots[lobbyID] = append(bots[lobbyID], bot)
}

func setMapKey(db *sqlx.DB, lobbyID string) MapData {
	lobby, err := getLobbyData(db, lobbyID)
	if err != nil {
		log.Println(err)
	}
	mapData, err := getMapData(db, lobby.MapID)
	if err != nil {
		log.Println(err)
	}
	return *mapData
}
