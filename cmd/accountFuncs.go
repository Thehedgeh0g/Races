package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/jmoiron/sqlx"
)

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
