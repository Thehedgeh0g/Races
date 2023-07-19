package main

type Bot struct {
	x     int
	y     int
	speed float64
	angle float64
}

type ResultsTable struct {
	Money string
	Exp   string
}

type Garage struct {
	Cars        []Car
	CountOfCars int
	ColorCost   int
	ACarCost    int
	BCarCost    int
	UCarCost    int
	UpgradeCost int
	Money       string
}

type Car struct {
	Scr          string
	Transmission string
	Engine       string
	Breaks       string
	Suspension   string
	Stock        string
	IsChoosen    string
}

type LobbySettings struct {
	MapID  string `json:"MapID"`
	Rounds string `json:"Rounds"`
}

type UserRequest struct {
	Email    string `json:"Email"`
	Password string `json:"Password"`
}

type FriendRequest struct {
	Nick string `json:"Nick"`
}

type Userdata struct {
	UserId   string
	Email    string
	Password string
}

type CreationPage struct {
	Token string
	Maps  []MapsData
}

type MapsData struct {
	MapID      string `db:"sprite_id"`
	MapPreview []PreviewData
}

type PreviewData struct {
	CellPath string `db:"sprite_path"`
}

type GameMap struct {
	GameArea [225]CellsData
}

type CellsData struct {
	CellInfo string
}

type SpriteData struct {
	SpriteId   string `db:"sprite_id"`
	SpritePath string `db:"sprite_path"`
}

type MapData struct {
	MapKey string `db:"map_data"`
}

type Player struct {
	ImgPath  string `db:"avatar"`
	Nickname string `db:"nickname"`
	Level    string `db:"exp"`
}

type AccountPlayer struct {
	ImgPath  string `db:"avatar"`
	Nickname string `db:"nickname"`
	Lvl      string `db:"exp"`
	Bosses   string `db:"boss_count"`
}

type AccountData struct {
	ImgPath  string `db:"avatar"`
	Nickname string `db:"nickname"`
	Lvl      string `db:"exp"`
	Bosses   string `db:"boss_count"`
	Friends  []*FriendsData
}

type FriendsData struct {
	Nickname string `db:"nickname"`
}
