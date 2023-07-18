package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
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

		usersMoney, err := getMoney(db, userID)
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
			Money:       usersMoney,
		}

		response := struct {
			Garage Garage `json:"Garage"`
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

func getMoney(db *sqlx.DB, userID string) (string, error) {

	query := `
		SELECT
		  money
		FROM
		  users
		WHERE
		  user_id = ?    
	`

	var usersMoneyStr string

	row := db.QueryRow(query, userID)

	err := row.Scan(&usersMoneyStr)
	if err != nil {
		return "", err
	}

	return usersMoneyStr, nil
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
	log.Println(carsStr)
	var cars []Car
	var car Car

	for _, carStr := range strings.Split(carsStr, " ") {
		log.Println(carStr)
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

		ID := getCarID(cars, req)

		lastStock, err := getLastCar(cars, req)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		success := false

		success, err = updateCar(db, userID, req, ID, lastStock)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}

		response := struct {
			Response bool `json:"response"`
		}{
			Response: success,
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

func getCarID(cars []Car, req string) int {
	for id, car := range cars {
		if car.Scr[0] == req[0] {
			return id
		}
	}
	return 404
}

func getLastCar(cars []Car, req string) (int, error) {
	max := -100
	for _, car := range cars {
		stock, err := strconv.Atoi(car.Stock)
		if err != nil {
			log.Println(err.Error())
			return 404, err
		}
		if stock > max {
			max = stock
		}
	}
	return max, nil
}

func updateCar(db *sqlx.DB, userID, req string, carID, stock int) (bool, error) {
	query := `
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
		return false, err
	}
	carCanBeBought := false
	carsArr := strings.Split(carsStr, " ")
	if strings.Split(carsArr[carID], "/")[5] == "0" {
		carCanBeBought = true

	}

	var carCost int
	switch {
	case req[0] == 'A':
		carCost = 10000
	case req[0] == 'B':
		carCost = 12000
	case req[0] == 'U':
		carCost = 14000
	default:
		carCost = 1
	}

	query = `
		SELECT
		  money
		FROM
		  users
		WHERE
		  user_id = ?    
	`

	var usersMoneyStr string

	row = db.QueryRow(query, userID)

	err = row.Scan(&usersMoneyStr)
	if err != nil {
		return false, err
	}

	usersMoney, err := strconv.Atoi(usersMoneyStr)
	if err != nil {
		return false, err
	}

	if (usersMoney-carCost >= 0) && carCanBeBought {
		stmt := `UPDATE users SET money = ? WHERE user_id = ?`

		_, err := db.Exec(stmt, strconv.Itoa(usersMoney-carCost), userID)
		if err != nil {
			return false, err
		}

		strings.Split(carsArr[carID], "/")[5] = strconv.Itoa(stock + 1)
		cars := strings.Join(carsArr, " ")
		stmt = `UPDATE users SET cars = ? WHERE user_id = ?`

		_, err = db.Exec(stmt, cars, userID)
		if err != nil {
			return false, err
		}

		return true, nil
	}

	return false, nil

}

func buyColor(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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

		ID := getCarID(cars, req)

		success := false

		success, err = updateColor(db, userID, req, ID, cars)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}
		response := struct {
			Response bool `json:"response"`
		}{
			Response: success,
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

func updateColor(db *sqlx.DB, userID, req string, ID int, cars []Car) (bool, error) {

	query := `
		SELECT
		  money
		FROM
		  users
		WHERE
		  user_id = ?    
	`

	var usersMoneyStr string

	row := db.QueryRow(query, userID)

	err := row.Scan(&usersMoneyStr)
	if err != nil {
		return false, err
	}

	query = `
		SELECT
		  cars
		FROM
		  users
		WHERE
		  user_id = ?    
	`

	var carsStr string

	row = db.QueryRow(query, userID)

	err = row.Scan(&carsStr)
	if err != nil {
		return false, err
	}

	carsArr := strings.Split(carsStr, " ")

	usersMoney, err := strconv.Atoi(usersMoneyStr)
	if err != nil {
		return false, err
	}

	canBeBought := false

	if usersMoney-100 > 0 {
		canBeBought = true
	}
	if canBeBought {
		stmt := `UPDATE users SET money = ? WHERE user_id = ?`

		_, err = db.Exec(stmt, strconv.Itoa(usersMoney-100), userID)
		if err != nil {
			return false, err
		}
		color := req[1]
		carsArr[ID] = string(carsArr[ID][1]) + string(color) + carsArr[ID][2:]
		cars := strings.Join(carsArr, " ")
		stmt = `UPDATE users SET cars = ? WHERE user_id = ?`

		_, err = db.Exec(stmt, cars, userID)
		if err != nil {
			return false, err
		}

		return true, nil
	}

	return false, nil
}

func tune(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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

		ID := getCarID(cars, req)

		success := false

		success, err = updateStats(db, userID, req, ID, cars)
		if err != nil {
			http.Error(w, "Server Error", 500)
			log.Println(err.Error())
			return
		}
		response := struct {
			Response bool `json:"response"`
		}{
			Response: success,
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

func updateStats(db *sqlx.DB, userID, req string, ID int, cars []Car) (bool, error) {

	query := `
		SELECT
		  money
		FROM
		  users
		WHERE
		  user_id = ?    
	`

	var usersMoneyStr string

	row := db.QueryRow(query, userID)

	err := row.Scan(&usersMoneyStr)
	if err != nil {
		return false, err
	}

	query = `
		SELECT
		  cars
		FROM
		  users
		WHERE
		  user_id = ?    
	`

	var carsStr string

	row = db.QueryRow(query, userID)

	err = row.Scan(&carsStr)
	if err != nil {
		return false, err
	}

	carsArr := strings.Split(carsStr, " ")

	usersMoney, err := strconv.Atoi(usersMoneyStr)
	if err != nil {
		return false, err
	}

	var tuneCost int

	for _, tune := range strings.Split(req, "/")[1:4] {
		price, err := strconv.Atoi(tune)
		if err != nil {
			return false, err
		}
		tuneCost += price * 200
	}

	canBeBought := false

	if usersMoney-tuneCost > 0 {
		canBeBought = true
	}
	if canBeBought {
		stmt := `UPDATE users SET money = ? WHERE user_id = ?`

		_, err = db.Exec(stmt, strconv.Itoa(usersMoney-tuneCost), userID)
		if err != nil {
			return false, err
		}
		carsArr[ID] = string(carsArr[ID][:2]) + req + carsArr[ID][15:]
		cars := strings.Join(carsArr, " ")
		stmt = `UPDATE users SET cars = ? WHERE user_id = ?`

		_, err = db.Exec(stmt, cars, userID)
		if err != nil {
			return false, err
		}

		return true, nil
	}

	return false, nil
}
