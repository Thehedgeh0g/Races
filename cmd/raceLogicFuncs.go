package main

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jmoiron/sqlx"
)

func getIDs(db *sqlx.DB, sessionID string) ([]string, error) {
	lobby, err := getLobbyData(db, sessionID)
	var IDs []string
	IDs = append(IDs, lobby.HostID, lobby.Player2ID, lobby.Player3ID, lobby.Player4ID)
	if err != nil {
		log.Println(err.Error(), "tutb")
		return IDs, err
	}
	return IDs, nil
}

func getSequence(tableStrings []string) ([]int, error) {
	var sequence []int
	for _, playerResults := range tableStrings {
		CID, err := strconv.Atoi(strings.Split(playerResults, "/")[0])
		if err != nil {
			log.Println(err.Error())
			return sequence, err
		}
		sequence = append(sequence, CID)
	}
	return sequence, nil
}
func sendMessageToGroup(db *sqlx.DB, message, group string) {
	for _, conn := range groups[group] {
		err := conn.WriteJSON(message)
		if err != nil {
			log.Println(err)
			delete(connections, conn)
			removeConnectionFromGroups(db, conn)
		}
	}
}

func addToGroup(conn *websocket.Conn, groupID string) {
	if !Contains(groups[groupID], conn) {
		groups[groupID] = append(groups[groupID], conn)
	}

}

func Contains(a []*websocket.Conn, x *websocket.Conn) bool {
	for _, n := range a {
		if x == n {
			return true
		}
	}
	return false
}

func determineGroup(clientID, groupID string) string {
	for group := range groups {
		if strings.Split(clientID, " ")[0] == group {
			return group
		} else {
			continue
		}
	}

	return ""
}

func removeConnectionFromGroups(db *sqlx.DB, conn *websocket.Conn) {
	delete(connections, conn)

	for group, conns := range groups {
		for i, c := range conns {
			if c == conn {
				groups[group] = append(conns[:i], conns[i+1:]...)
				break
			}
		}
		deleteGroup(db, group)
	}

}

func deleteGroup(db *sqlx.DB, groupID string) {
	fmt.Printf("groups[groupID]: %v\n", groups[groupID])
	if groups[groupID] == nil {
		delete(groups, groupID)
		deleteSession(db, groupID)
	}
}

func createGroup(groupName string) {
	groups[groupName] = []*websocket.Conn{}
	races[groupName] = ""
}

func generateClientID() string {
	return time.Now().Format("20060102150405")
}

func messageStrToObj(posMessage string) Message {
	var messageObj Message
	messageObj.isFinished = strings.Split(posMessage, " ")[10]
	messageObj.hp = strings.Split(posMessage, " ")[9]
	messageObj.readinessSpeed = strings.Split(posMessage, " ")[2]
	messageObj.angle = strings.Split(posMessage, " ")[3]
	messageObj.y = strings.Split(posMessage, " ")[6]
	messageObj.SessionID = strings.Split(posMessage, " ")[0]
	messageObj.x = strings.Split(posMessage, " ")[7]
	messageObj.inSessionID = strings.Split(posMessage, " ")[8]

	return messageObj
}

func verificatePos(db *sqlx.DB, posMessage, group string) string {

	mes := messageStrToObj(posMessage)

	y, _ := strconv.Atoi(mes.y)
	x, _ := strconv.Atoi(mes.x)

	if (strings.Split(mes.isFinished, "/")[0] == "1") && !(strings.Contains(races[mes.SessionID], mes.inSessionID+"/")) {
		log.Println("tyt")
		races[mes.SessionID] = races[mes.SessionID] + " " + mes.inSessionID + "/" + strings.Split(mes.isFinished, "/")[1]
	} else if (strings.Split(mes.isFinished, "/")[0] == "2") && !(strings.Contains(races[mes.SessionID], mes.inSessionID+"/")) {
		log.Println("tut")
		races[mes.SessionID] = races[mes.SessionID] + " " + mes.inSessionID + "/" + "NF"
	}

	botProcessing(db, mes.SessionID, mes.readinessSpeed, mes.hp, group, mes.isFinished, x, y)

	posMessage = mes.y + " " + mes.x + " " + mes.angle + " " + mes.readinessSpeed + " " + mes.hp + " " + mes.inSessionID + races[mes.SessionID]

	return posMessage

}

func botProcessing(db *sqlx.DB, sessionID, readiness, hp, group, isFinished string, x, y int) {

	bot := bots[sessionID]
	if (bot.x != 0) && (bot.y != 0) {
		bot = collision(bot, x, y, hp)
		if (bot.hp > 0) && !(strings.Contains(races[sessionID], bot.inSessionId+"/")) && (strings.Contains(readiness, "2/")) {
			bot = AI(db, sessionID, bot)
			if bot.laps <= 0 {
				races[sessionID] = races[sessionID] + " " + bot.inSessionId + "/" + strings.Split(isFinished, "/")[1]
				log.Println(races[sessionID])
			}
		} else if bot.hp < 0 {
			races[sessionID] = races[sessionID] + " " + bot.inSessionId + "/" + "NF"
		}

		botMessage := fmt.Sprintf("%f", bot.x) + " " + fmt.Sprintf("%f", bot.y) + " " + fmt.Sprintf("%f", bot.angle) + " " + "1/" + fmt.Sprintf("%f", bot.speed) + " " + strconv.Itoa(bot.hp) + " " + bot.inSessionId + races[sessionID]

		bots[sessionID] = bot

		connMutex.Lock()
		sendMessageToGroup(db, botMessage, group)
		connMutex.Unlock()
	}

}

func processResults(db *sqlx.DB, results ResultsTable, sequence []int, tableStrings, IDs []string, userID string, isBoss bool) (ResultsTable, error) {
	modifier := 0
	if !isBoss {
		for place, inSessionId := range sequence {
			fmt.Printf("tableStrings[place]: %v\n", tableStrings[place])
			if inSessionId < 4 {
				if strings.Split(tableStrings[place], "/")[1] != "NF" {
					if IDs[inSessionId] == userID {
						modifier = 4 - place
					}
				} else {
					if IDs[inSessionId] == userID {
						modifier = 0
					}
				}
			}
		}
	} else {
		if IDs[sequence[1]] == userID {
			modifier = 0
		} else {
			modifier = 6
			err := updateBossCount(db, userID)
			if err != nil {
				log.Println(err.Error())
				return results, err
			}
		}
	}

	err := saveResults(db, userID, modifier)
	if err != nil {
		log.Println(err.Error())
		return results, err
	}

	results.Money = strconv.Itoa(15 * modifier)
	results.Exp = strconv.Itoa(13 * modifier)
	return results, nil
}
