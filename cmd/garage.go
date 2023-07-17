package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/jmoiron/sqlx"
)

func garageData(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		cars, err := getCars(db, userID)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		garageData := Garage{
			Cars:        cars,
			CountOfCars: len(cars),
			ColorCost:   100,
			ACarCost:    10000,
			BCarCost:    12000,
			UCarCost:    14000,
			UpgradeCost: 200,
		}

		response := struct {
			Garage Garage `json:"Host"`
		}{
			Garage: garageData,
		}

		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)

	}
}

func getCars(db *sqlx.DB, userID string) ([]Car, error) {
	const query = `
		SELECT
		  cars
		FROM
		  users
		WHERE
		  user_id = ?    
	`

	var carsStr string

	row := db.QueryRow(query, userID)

	err := row.Scan(&carsStr)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	var cars []Car
	var car Car

	for _, carStr := range strings.Split(carsStr, " ") {
		car.Scr = strings.Split(carStr, "/")[0]
		car.Transmission = strings.Split(carStr, "/")[1]
		car.Engine = strings.Split(carStr, "/")[2]
		car.Breaks = strings.Split(carStr, "/")[3]
		car.Suspension = strings.Split(carStr, "/")[4]
		car.Stock = strings.Split(carStr, "/")[5]
		car.IsChoosen = strings.Split(carStr, "/")[6]
		cars = append(cars, car)
	}

	return cars, nil
}

func buyCar(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
		}

		var req string

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		userID, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		cars, err := getCars(db, userID)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		garageData := Garage{
			Cars:        cars,
			CountOfCars: len(cars),
			ColorCost:   100,
			ACarCost:    10000,
			BCarCost:    12000,
			UCarCost:    14000,
			UpgradeCost: 200,
		}

		response := struct {
			Garage Garage `json:"Host"`
		}{
			Garage: garageData,
		}

		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)

	}
}
