package main

type UserData struct {
	ID         string
	Email      string `db:"email"`
	Password   string `db:"password"`
	ImgPath    string `db:"avatar"`
	Lvl        string `db:"exp"`
	Money      int    `db:"money"`
	Bosses     string `db:"boss_count"`
	Nickname   string `db:"nickname"`
	Friends    string `db:"friends"`
	Cars       string `db:"cars"`
	CurLobbyID string `db:"curLobbyId"`
}

type MapData struct {
	MapID  string `db:"map_id"`
	MapKey string `db:"map_data"`
}

type LobbyData struct {
	LobbyID      string `db:"session_id"`
	HostID       string `db:"host_id"`
	Player2ID    string `db:"player1_id"`
	Player3ID    string `db:"player2_id"`
	Player4ID    string `db:"player_id"`
	MapID        string `db:"map_id"`
	Laps         string `db:"rounds"`
	InfiniteHP   bool   `db:"hp"`
	CollisionOFF bool   `db:"collision"`
	Boss         bool   `db:"boss"`
}

type SpriteData struct {
	SpriteId   string `db:"sprite_id"`
	SpritePath string `db:"sprite_path"`
}

type PriceData struct {
	ACarPrice  int `db:"aCarPrice"`
	BCarPrice  int `db:"bCarPrice"`
	UCarPrice  int `db:"uCarPrice"`
	ColorPrice int `db:"colorPrice"`
	ModPrice   int `db:"modPrice"`
}
