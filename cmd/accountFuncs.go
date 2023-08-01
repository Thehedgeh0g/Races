package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/jmoiron/sqlx"
)

func getFriends(db *sqlx.DB, userID string) ([]*FriendsData, error) {
	user, err := getUser(db, userID)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	IDs := strings.Split(user.Friends, " ")

	var nicks []*FriendsData
	for _, id := range IDs {
		if id != "0" {
			var nick FriendsData
			friend, err := getUser(db, id)
			if err != nil {
				log.Println(err.Error())
				return nil, err
			}

			nick.Nickname = friend.Nickname
			nick.Avatar = friend.ImgPath
			nick.Lvl = friend.Lvl

			nicks = append(nicks, &nick)
			log.Println(nicks)
		}

	}

	return nicks, nil

}

func getAchivments(db *sqlx.DB, userID string) ([]*AchivmentData, error) {
	user, err := getUser(db, userID)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	IDs := strings.Split(user.Achivments, "/")

	var achivments []*AchivmentData
	for _, id := range IDs {
		if (id != "0") && (id != "") {
			fmt.Printf("id: %v\n", id)
			achivment, err := getAchivment(db, id)
			if err != nil {
				log.Println(err.Error(), "tut")
				return nil, err
			}
			achivments = append(achivments, &achivment)
		}

	}

	return achivments, nil

}
