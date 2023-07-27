package main

// перекинуть рутер в отдельный пакет
// архитектура api/app/infostucture
// бд отдельно вынеси
// разделить структуры бд/реквесты
// вынести функцию для парса
import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

const (
	port         = ":3000"
	dbDriverName = "mysql"
)

func main() {
	db, err := OpenDB()
	if err != nil {
		log.Fatal(err)
	}

	dbx := sqlx.NewDb(db, dbDriverName)

	mux := mux.NewRouter()
	mux.HandleFunc("/login", login)
	mux.HandleFunc("/menu", menu)
	mux.HandleFunc("/lobby/{lobbyID}", lobbyHandler(dbx))
	mux.HandleFunc("/race/{lobbyID}", gameAreaHandler(dbx))
	mux.HandleFunc("/account", accountHandler(dbx))
	mux.HandleFunc("/garage", garageHandler)
	mux.HandleFunc("/registration", handleReg)
	mux.HandleFunc("/constructor", handleconstruct)

	mux.HandleFunc("/ws", handleWebSocket(dbx))

	mux.HandleFunc("/api/registrate", getNewUser(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/recordKey", recordKey(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/getSprites", getSprites(dbx)).Methods(http.MethodGet)
	mux.HandleFunc("/api/chooseCar", chooseCar(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/buyStats", tune(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/buyColor", buyColor(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/buyCar", buyCar(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/getGarageData", garageData(dbx)).Methods(http.MethodGet)
	mux.HandleFunc("/api/addFriend", addFriend(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/getTable", getTable(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/getHost", hostCheck(dbx)).Methods(http.MethodGet)
	mux.HandleFunc("/api/getPlayers", sendPlayers(dbx)).Methods(http.MethodGet)
	mux.HandleFunc("/api/getLobbyID", sendLobbyID(dbx)).Methods(http.MethodGet)
	mux.HandleFunc("/api/chooseMap", chooseMap(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/getKey", sendKey(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/join", joinLobby(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/createBossLobby", createBossLobby(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/create", createLobby(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/login", searchUser(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/logout", deleteUser(dbx)).Methods(http.MethodPost)

	mux.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	fmt.Println("Start server " + port)
	err = http.ListenAndServe(port, mux)
	if err != nil {
		log.Fatal(err)
	}
}

func OpenDB() (*sql.DB, error) {
	// Здесь прописываем соединение к базе данных
	return sql.Open(dbDriverName, "root:BaStInDa06081981!@tcp(localhost:3306)/brainless_races?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true")
}
