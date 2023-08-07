package main

import (
	"log"
	"strconv"
	"strings"

	"github.com/jmoiron/sqlx"
)

func getCarID(cars []Car, req string) int {
	for id, car := range cars {
		if car.Scr[0] == req[0] {
			return id
		}
	}
	return 404
}

func updateCar(db *sqlx.DB, userID, req, method string, carID int) (bool, error) {
	user, err := getUser(db, userID)
	if err != nil {
		log.Println(err.Error())
		return false, err
	}
	cars := strings.Split(user.Cars, " ")

	var price int

	prices, err := getPrices(db)
	if err != nil {
		log.Println(err.Error())
		return false, err
	}

	if method == "buy" {
		switch {
		case req[0] == 'A':
			price = prices.ACarPrice
		case req[0] == 'B':
			price = prices.BCarPrice
		case req[0] == 'U':
			price = prices.UCarPrice
		default:
			price = 1
		}
		if (user.Money-price >= 0) && !doUserHaveCar(cars, carID) {
			cars[carID] = cars[carID][:15] + "1" + cars[carID][16:]
			user.Cars = strings.Join(cars, " ")
		} else {
			return false, nil
		}
	} else if method == "recolorate" {
		price = prices.ColorPrice
		color := req[1]
		if (user.Money-price >= 0) && doUserHaveCar(cars, carID) {
			cars[carID] = string(cars[carID][:1]) + string(color) + cars[carID][2:]
			user.Cars = strings.Join(cars, " ")
		} else {
			return false, nil
		}
	} else if method == "mod" {
		var tuneCost int
		for _, tune := range strings.Split(req, "/")[1:5] {
			price, err := strconv.Atoi(tune)
			if err != nil {
				return false, err
			}
			tuneCost += price * prices.ModPrice
		}

		for _, tune := range strings.Split(cars[carID][3:14], "/")[:4] {
			itWas, err := strconv.Atoi(tune)
			if err != nil {
				return false, err
			}
			tuneCost -= itWas * prices.ModPrice
		}
		price = tuneCost
		if (user.Money-tuneCost >= 0) && doUserHaveCar(cars, carID) {
			cars[carID] = string(cars[carID][:2]) + req[1:] + cars[carID][15:]
			user.Cars = strings.Join(cars, " ")
		} else {
			return false, nil
		}
	} else if method == "choose" {
		if carStrToObjArr(user.Cars)[carID].Stock == "1" {
			for i := range cars {
				cars[i] = cars[i][:17] + "0"
			}
			cars[carID] = cars[carID][:17] + "1"
			user.Cars = strings.Join(cars, " ")
		} else {
			return false, err
		}
	}
	updateCarStatement(db, user.Cars, strconv.Itoa(user.Money-price), userID)

	return true, nil

}

func doUserHaveCar(cars []string, carID int) bool {
	return strings.Split(cars[carID], "/")[5] != "0"
}

func getCars(db *sqlx.DB, userID string) ([]Car, error) {
	user, err := getUser(db, userID)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	carsStr := user.Cars

	cars := carStrToObjArr(carsStr)

	return cars, nil
}

func carStrToObjArr(carsStr string) []Car {
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
	return cars
}
