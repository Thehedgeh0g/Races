package main

import (
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/jmoiron/sqlx"
)

func getUserForLog(db *sqlx.DB, req UserRequest) (UserData, error) {
	const query = `
	SELECT
	  user_id
  	FROM
	  users
  	WHERE
	  email = ? AND
	  password = ?
	`
	row := db.QueryRow(query, req.Email, req.Password)
	var user UserData
	err := row.Scan(&user.Id)
	if err != nil {
		return user, err
	}

	return user, nil
}

func getUser(db *sqlx.DB, userID string) (UserData, error) {
	const query = `
	SELECT
	  user_id,
	  avatar,
	  boss_count,
	  exp,
	  money,
	  nickname,
	  friends,
	  cars,
	  currLobby_id,
	  usersAchivments
  	FROM
	  users
  	WHERE
	  user_id = ?
	`
	row := db.QueryRow(query, userID)
	var user UserData
	err := row.Scan(&user.Id, &user.ImgPath, &user.Bosses, &user.Lvl, &user.Money, &user.Nickname, &user.Friends, &user.Cars, &user.CurLobbyID, &user.Achivments)
	if err != nil {
		return user, err
	}

	return user, nil
}

func getPrices(db *sqlx.DB) (PriceData, error) {
	const query = `
	SELECT
	  *
	FROM
	  prices  
	`
	var prices PriceData
	row := db.QueryRow(query)
	err := row.Scan(&prices.ACarPrice, &prices.BCarPrice, &prices.UCarPrice, &prices.ColorPrice, &prices.ModPrice)

	if err != nil {
		return prices, err
	}
	return prices, nil
}

func getLobbyData(db *sqlx.DB, lobbyID string) (LobbyData, error) {
	const query = `
	SELECT
	  *
  	FROM
	  sessions
  	WHERE
	  session_id = ?
	`
	row := db.QueryRow(query, lobbyID)
	var lobby LobbyData
	err := row.Scan(&lobby.LobbyID, &lobby.HostID, &lobby.Player2ID, &lobby.Player3ID, &lobby.Player4ID, &lobby.MapID, &lobby.Laps, &lobby.InfiniteHP, &lobby.CollisionOFF, &lobby.Boss, &lobby.InProgress)
	if err != nil {
		return lobby, err
	}

	return lobby, nil
}

func getMapIDs(db *sqlx.DB) ([]string, error) {
	query := `
	SELECT
	  map_id
  	FROM
	  maps   
  	`
	var IDs []string
	err := db.Select(&IDs, query)
	if err != nil {
		return nil, err
	}
	return IDs, nil
}

func updateCarStatement(db *sqlx.DB, cars, money, userID string) error {
	stmt := `UPDATE users SET cars = ?, money = ? WHERE user_id = ?`

	res, err := db.Exec(stmt, cars, money, userID)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return err
	} else {
		result, _ := res.RowsAffected()
		fmt.Printf("result: %v\n", result)
	}
	return nil
}

func insert(db *sqlx.DB, lobby_id, hostId, player1_id, player2_id, player3_id string, boss bool) error {
	stmt := `INSERT INTO sessions (session_id, host_id, player2_id, player3_id, player4_id, rounds, boss)
    VALUES(?, ?, ?, ?, ?, ?, ?)`
	var rounds string
	if boss {
		rounds = "10"
	} else {
		rounds = "1"
	}
	_, err := db.Exec(stmt, lobby_id, hostId, player1_id, player2_id, player3_id, rounds, boss)
	if err != nil {
		return err
	}

	return nil
}

func UPDATE(db *sqlx.DB, userID string, lobbyID int) error {
	stmt := `UPDATE users SET currLobby_id = ? WHERE user_id = ?`

	_, err := db.Exec(stmt, lobbyID, userID)
	if err != nil {
		return err
	}

	return nil
}

func setUsersLobby(db *sqlx.DB, lobbyID, userID string) error {
	const query = `
		UPDATE
			brainless_races.users
		SET
			currLobby_id = ?
		WHERE
			user_id = ?    
	`

	_, err := db.Exec(query, lobbyID, userID)

	if err != nil {
		return err
	}

	return nil
}

func addUserIntoLobby(db *sqlx.DB, inSessionID, lobbyID, userID string) error {
	var stmt string
	if inSessionID == "2" {
		stmt = "UPDATE sessions SET player2_id = ? WHERE session_id = ?"
	} else if inSessionID == "3" {
		stmt = "UPDATE sessions SET player3_id = ? WHERE session_id = ?"
	} else if inSessionID == "4" {
		stmt = "UPDATE sessions SET player4_id = ? WHERE session_id = ?"
	}
	_, err := db.Exec(stmt, userID, lobbyID)
	if err != nil {
		return err
	}

	return nil
}

func getMapData(db *sqlx.DB, mapId string) (*MapData, error) {
	query := "SELECT map_data FROM maps WHERE map_id = ?"

	key := new(MapData)

	row := db.QueryRow(query, mapId)
	err := row.Scan(&key.MapKey)
	if err != nil {
		return nil, err
	}
	return key, nil
}

func getSprite(db *sqlx.DB, spriteId int) (*SpriteData, error) {
	const query = `SELECT
	  sprite_path
	FROM
	  sprites
	WHERE
	  sprite_id = ?    
	`

	newSprite := new(SpriteData)

	row := db.QueryRow(query, spriteId)
	err := row.Scan(&newSprite.SpritePath)
	if err != nil {
		return nil, err
	}

	return newSprite, err
}

func getLobbyID(db *sqlx.DB, userID int) (int, error) {
	const query = `SELECT
	  currLobby_id
	FROM
	  users
	WHERE
	  user_id = ?    
	`

	row := db.QueryRow(query, userID)
	var ID int
	err := row.Scan(&ID)
	if err != nil {
		return 0, err
	}

	return ID, nil
}

func deleteSessionRow(db *sqlx.DB, lobbyID string) error {
	var stmt = `
		DELETE 
		FROM 
		  sessions 
		WHERE 
		  session_id = ?
	`

	_, err := db.Exec(stmt, lobbyID)
	if err != nil {
		log.Println(err.Error())
		return err
	}
	return nil
}

func clearCurLobbyId(db *sqlx.DB, userID string) error {
	const stmt = `
		UPDATE
		  users
		SET
		  currLobby_id = ? 
		WHERE
		  user_id = ?    
	`

	res, err := db.Exec(stmt, "0", userID)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return err
	} else {
		result, _ := res.RowsAffected()
		fmt.Printf("result: %v\n", result)
	}

	return nil
}

func setLobbySettings(db *sqlx.DB, mapID, laps, LobbyID string, hp, collision bool) error {
	query := `
			UPDATE
			  brainless_races.sessions
			SET
			  map_id = ?,
			  rounds = ?,
			  hp = ?,
			  collision = ?
			WHERE
			  session_id = ?    
		`

	_, err := db.Exec(query, mapID, laps, hp, collision, LobbyID)
	if err != nil {
		return err
	}

	return nil
}

func getUserByNick(db *sqlx.DB, recieverNick string) (string, error) {
	const query = `
	SELECT
	  user_id
  	FROM
	  users
  	WHERE
	  nickname = ?
	`
	var ID string

	row := db.QueryRow(query, recieverNick)
	err := row.Scan(&ID)
	if err != nil {
		return "", err
	}

	return ID, nil
}

func getSprites(db *sqlx.DB) ([]string, error) {
	const query = `
		SELECT
		  sprite_path
		FROM
		  sprites  
	`
	var sprites []string
	err := db.Select(&sprites, query)
	if err != nil {
		return nil, err
	}
	return sprites, nil
}

func saveMap(db *sqlx.DB, key string) error {
	const stmt = `
		INSERT INTO 
	  	  maps (map_data)
		VALUES
		  (?)
	`

	_, err := db.Exec(stmt, key[:len(key)-1])

	if err != nil {
		return err
	}

	return nil
}

func getAchivment(db *sqlx.DB, achivmentID string) (AchivmentData, error) {
	const query = `
		SELECT
		  *
		FROM
		  achivments
		WHERE
		  achivmentID = ?  
	`
	var achivment AchivmentData
	row := db.QueryRow(query, achivmentID)
	err := row.Scan(&achivment.AchivmentID, &achivment.Achivment, &achivment.AchivmentDesc, &achivment.AchivmentPath, &achivment.AchivmentCom)
	if err != nil {
		return achivment, err
	}

	return achivment, nil
}

func updateAchivments(db *sqlx.DB, user UserData, achivmentID string) error {
	stmt := `UPDATE users SET usersAchivments = ? WHERE user_id = ?`
	achivmentsStr := user.Achivments + "/" + achivmentID + "/"
	_, err := db.Exec(stmt, achivmentsStr, user.Id)
	if err != nil {
		return err
	}

	return nil
}

func addUser(db *sqlx.DB, newUser User) error {
	const stmt = `
		INSERT INTO 
	  	  users (email, password, Avatar, nickname, friends, usersAchivments)
		VALUES
		  (?, ?, ?, ?, ?, ?)`

	_, err := db.Exec(stmt, newUser.Email, newUser.Password, "../static/img/"+newUser.AvatarName, newUser.Nickname, "0", "/0/")

	if err != nil {
		log.Println(err.Error())
		return err
	}
	return nil
}

func createFriendsReq(db *sqlx.DB, request FriendRequest) error {

	const stmt = `
		INSERT INTO
		  friendreq (recieverID, senderID, status)
		VALUES
		  (?, ?, ?)  
	`
	_, err := db.Exec(stmt, request.RecieverID, request.SenderID, request.Status)

	if err != nil {
		log.Println(err.Error())
		return err
	}
	return nil
}

func getReqList(db *sqlx.DB, recieverID string) ([]FriendRequest, error) {
	const query = `
		SELECT
		  *
		FROM
		  friendreq
		WHERE 
		  recieverID = ? AND
          status = ?
	`
	var requests []FriendRequest
	err := db.Select(&requests, query, recieverID, "0")
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	return requests, nil
}

func deleteReq(db *sqlx.DB, req FriendRequest) error {
	const stmt = `
		DELETE 
		FROM 
		  friendreq 
		WHERE 
		  recieverID = ? AND senderID = ?
	`

	_, err := db.Exec(stmt, req.RecieverID, req.SenderID)
	if err != nil {
		log.Println(err.Error())
		return err
	}
	return nil
}

func updateFriends(db *sqlx.DB, isReciever bool, request FriendRequest) error {
	var user UserData
	var err error
	if isReciever {
		user, err = getUser(db, request.RecieverID)

	} else {
		user, err = getUser(db, request.SenderID)
	}
	if err != nil {
		log.Println(err.Error())
		return err
	}

	friendList := user.Friends

	if isReciever {
		friendList += " " + request.SenderID
	} else {
		friendList += " " + request.RecieverID
	}

	const stmt = `UPDATE users SET friends = ? WHERE user_id = ?`
	_, err = db.Exec(stmt, friendList, user.Id)
	if err != nil {
		log.Println(err.Error())
		return err
	}
	return nil
}

func saveResults(db *sqlx.DB, userID string, modificator int) error {
	user, err := getUser(db, userID)
	if err != nil {
		return err
	}

	exp, err := strconv.Atoi(user.Lvl)
	if err != nil {
		return err
	}

	stmt := `UPDATE users SET money = ?, exp = ? WHERE user_id = ?`

	_, err = db.Exec(stmt, strconv.Itoa(15*modificator+user.Money), strconv.Itoa(13*modificator+exp), userID)
	if err != nil {
		log.Println("tuta")
		return err
	}
	return nil
}

func checkRequests(db *sqlx.DB, recieverID, senderID string) bool {
	const query = `
		SELECT
		  *
		FROM 
		  friendreq 
	  	WHERE 
		  recieverID = ? AND senderID = ?
	`
	var request FriendRequest
	var exists bool
	row := db.QueryRow(query, recieverID, senderID)
	err := row.Scan(&request.RecieverID, &request.SenderID, &request.Status)
	if err != nil {
		exists = false
	} else {
		exists = true
	}
	if !exists {
		row = db.QueryRow(query, senderID, recieverID)
		err = row.Scan(&request.RecieverID, &request.SenderID, &request.Status)
		if err != nil {
			exists = false
		} else {
			exists = true
		}
	}
	return exists
}

func deleteFromFriendList(db *sqlx.DB, userID, friendID string) error {
	user, err := getUser(db, userID)
	if err != nil {
		return err
	}
	friendList := strings.Split(user.Friends, " ")
	for i, ID := range friendList {
		if ID == friendID {
			friendList[i] = ""
		}
	}
	friendsStr := strings.Join(friendList, " ")
	friendsStr = strings.Trim(friendsStr, " ")
	fmt.Printf("friendsStr: %v\n", friendsStr)
	const stmt = `UPDATE users SET friends = ? WHERE user_id = ?`
	_, err = db.Exec(stmt, friendsStr, userID)
	if err != nil {
		return err
	}
	return nil
}

func updateBossCount(db *sqlx.DB, userID string) error {

	user, err := getUser(db, userID)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return err
	}
	bossCount, err := strconv.Atoi(user.Bosses)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return err
	}

	bossCount += 1

	const stmt = `
		UPDATE 
		  users 
		SET 
		  boss_count = ? 
		WHERE 
		  user_id = ?
	`

	_, err = db.Exec(stmt, bossCount, userID)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return err
	}
	return nil
}

func deleteUserFromSession(db *sqlx.DB, user UserData) error {
	var stmt string
	if user.CurLobbyID != "0" {
		lobby, err := getLobbyData(db, user.CurLobbyID)
		if err != nil {
			return err
		}
		if lobby.HostID == user.Id {
			stmt = `UPDATE sessions SET host_id = ? WHERE session_id = ?`
		} else if lobby.Player2ID == user.Id {
			stmt = `UPDATE sessions SET player2_id = ? WHERE session_id = ?`
		} else if lobby.Player3ID == user.Id {
			stmt = `UPDATE sessions SET player3_id = ? WHERE session_id = ?`
		} else if lobby.Player4ID == user.Id {
			stmt = `UPDATE sessions SET player4_id = ? WHERE session_id = ?`
		}
		_, err = db.Exec(stmt, "0", user.CurLobbyID)
		if err != nil {
			fmt.Printf("err: %v\n", err)
			return err
		}
	}
	return nil
}
