package main

import (
	"fmt"

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
	err := row.Scan(&user.ID)
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
	err := row.Scan(&user.ID, &user.ImgPath, &user.Bosses, &user.Lvl, &user.Money, &user.Nickname, &user.Friends, &user.Cars, &user.CurLobbyID, &user.Achivments)
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
	err := row.Scan(&lobby.LobbyID, &lobby.HostID, &lobby.Player2ID, &lobby.Player3ID, &lobby.Player4ID, &lobby.MapID, &lobby.Laps, &lobby.InfiniteHP, &lobby.CollisionOFF, &lobby.Boss)
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
		rounds = "80"
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
	switch {
	case inSessionID == "2":
		stmt = "UPDATE sessions SET player2_id = ? WHERE session_id = ?"
	case inSessionID == "3":
		stmt = "UPDATE sessions SET player3_id = ? WHERE session_id = ?"
	case inSessionID == "4":
		stmt = "UPDATE sessions SET player4_id = ? WHERE session_id = ?"
	default:
		stmt = "UPDATE sessions SET player2_id = ? WHERE session_id = ?"
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

func getUserByNick(db *sqlx.DB, req FriendRequest) (string, error) {
	const query = `
	SELECT
	  user_id
  	FROM
	  users
  	WHERE
	  nickname = ?
	`
	var ID string

	row := db.QueryRow(query, req.Nick)
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
	const stmt = `INSERT INTO maps (map_data)
		VALUES(?)`

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
	_, err := db.Exec(stmt, achivmentsStr, user.ID)
	if err != nil {
		return err
	}

	return nil
}
