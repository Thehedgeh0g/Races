package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/jmoiron/sqlx"
)

func garageData(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, err := getUserID(db, r)
		if errorProcessor(err, w) {
			return
		}

		cars, err := getCars(db, userID)
		if errorProcessor(err, w) {
			return
		}

		user, err := getUser(db, userID)
		if errorProcessor(err, w) {
			return
		}

		prices, err := getPrices(db)
		if errorProcessor(err, w) {
			return
		}

		garageData := Garage{
			Cars:        cars,
			CountOfCars: len(cars),
			Prices:      prices,
			Money:       strconv.Itoa(user.Money),
		}

		response := struct {
			Garage Garage `json:"Garage"`
		}{
			Garage: garageData,
		}

		jsonResponse, err := json.Marshal(response)
		if errorProcessor(err, w) {
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)

	}
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
		if errorProcessor(err, w) {
			return
		}

		cars, err := getCars(db, userID)
		if errorProcessor(err, w) {
			return
		}

		ID := getCarID(cars, req)

		success := false

		success, err = updateCar(db, userID, req, "buy", ID)
		if errorProcessor(err, w) {
			return
		}

		response := struct {
			Response bool `json:"response"`
		}{
			Response: success,
		}

		jsonResponse, err := json.Marshal(response)
		if errorProcessor(err, w) {
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)

	}
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
		if errorProcessor(err, w) {
			return
		}

		cars, err := getCars(db, userID)
		if errorProcessor(err, w) {
			return
		}

		ID := getCarID(cars, req)

		success := false

		success, err = updateCar(db, userID, req, "recolorate", ID)
		if errorProcessor(err, w) {
			return
		}
		response := struct {
			Response bool `json:"response"`
		}{
			Response: success,
		}

		jsonResponse, err := json.Marshal(response)
		if errorProcessor(err, w) {
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)

	}
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
		if errorProcessor(err, w) {
			return
		}

		cars, err := getCars(db, userID)
		if errorProcessor(err, w) {
			return
		}

		ID := getCarID(cars, string(req[0]))

		success := false

		success, err = updateCar(db, userID, req, "mod", ID)
		if errorProcessor(err, w) {
			return
		}
		response := struct {
			Response bool `json:"response"`
		}{
			Response: success,
		}

		jsonResponse, err := json.Marshal(response)
		if errorProcessor(err, w) {
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)

	}
}

func chooseCar(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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

		ID, err := strconv.Atoi(req)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}
		userID, err := getUserID(db, r)
		if err != nil {
			http.Error(w, "Error", 500)
			log.Println(err.Error())
			return
		}

		success := false
		success, err = updateCar(db, userID, req, "choose", ID)
		if errorProcessor(err, w) {
			return
		}
		response := struct {
			Response bool `json:"response"`
		}{
			Response: success,
		}

		jsonResponse, err := json.Marshal(response)
		if errorProcessor(err, w) {
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)

	}
}
