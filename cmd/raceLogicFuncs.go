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
	fmt.Printf("sessionID: %v\n", sessionID)
	lobby, err := getLobbyData(db, sessionID)
	var IDs []string
	IDs = append(IDs, lobby.HostID, lobby.Player2ID, lobby.Player3ID, lobby.Player4ID)
	if err != nil {
		log.Println(err.Error(), "tutb")
		return IDs, err
	}
	return IDs, nil
}

func getSequence(tableStrings []string) ([]int, []string, error) {
	var NFsIds []string
	var finishedIds []string
	var table []string
	var finished []int
	var NFs []int
	for _, playerResults := range tableStrings {
		if strings.Split(playerResults, "/")[1] != "NF" {
			CID, err := strconv.Atoi(strings.Split(playerResults, "/")[0])
			if err != nil {
				log.Println(err.Error())
				return finished, finishedIds, err
			}
			finishedIds = append(finishedIds, playerResults)
			finished = append(finished, CID)
		} else {
			CID, err := strconv.Atoi(strings.Split(playerResults, "/")[0])
			if err != nil {
				log.Println(err.Error())
				return finished, finishedIds, err
			}
			NFsIds = append(NFsIds, playerResults)
			NFs = append(NFs, CID)
		}

	}
	var sequence []int
	sequence = append(sequence, finished...)
	sequence = append(sequence, NFs...)
	table = append(table, finishedIds...)
	table = append(table, NFsIds...)
	fmt.Printf("sequence: %v\n", sequence)
	return sequence, table, nil
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

func addToGroup(conn *websocket.Conn, groupID, lobbyID string) {
	if groupID == "" {
		groups[lobbyID] = append(groups[lobbyID], conn)
	} else if !Contains(groups[groupID], conn) {
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
			return groupID
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
	if len(groups[groupID]) == 0 {
		fmt.Printf("deleted groups[groupID]: %v\n", groups[groupID])
		delete(groups, groupID)
	}
}

func deleteSession(db *sqlx.DB, groupID string) {
	lobby, err := getLobbyData(db, groupID)
	if err != nil {
		log.Println("lobby not found")
		return
	}
	if (lobby.HostID == "0") && (lobby.Player2ID == "0") && (lobby.Player3ID == "0") && (lobby.Player4ID == "0") {
		fmt.Printf("lobby deleted: %v\n", lobby)
		deleteSessionRow(db, groupID)
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
		races[mes.SessionID] = races[mes.SessionID] + " " + mes.inSessionID + "/" + strings.Split(mes.isFinished, "/")[1]
	} else if (strings.Split(mes.isFinished, "/")[0] == "2") && !(strings.Contains(races[mes.SessionID], mes.inSessionID+"/")) {
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

		connMutex.Lock()
		sendMessageToGroup(db, botMessage, group)
		connMutex.Unlock()
		if (strings.Split(isFinished, "/")[0] == "1") || (strings.Split(isFinished, "/")[0] == "2") {
			bot.laps = 0
		}
		bots[sessionID] = bot
	}

}

func processResults(db *sqlx.DB, sequence []int, tableStrings, IDs []string, userID string, isBoss bool) (ResultsTable, error) {
	log.Println(isBoss)
	var results ResultsTable
	modifier := 0
	if !isBoss {
		for place, inSessionId := range sequence {
			fmt.Printf("tableStrings[place]: %v\n", tableStrings[place])
			fmt.Printf("place: %v\n", place)
			fmt.Printf("IDs[inSessionId]: %v\n", IDs[inSessionId])
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
