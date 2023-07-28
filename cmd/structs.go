package main

type Bot struct {
	x            float64
	y            float64
	speed        float64
	angle        float64
	inSessionId  string
	hp           int
	mapMatrix    [15][15]string
	visionMatrix [3][3]string
	userHP       string
	laps         int
	checks       int
}

type User struct {
	Email      string
	Password   string
	Avatar     string
	AvatarName string
	Nickname   string
}

type ResultsTable struct {
	Money string
	Exp   string
}

type Garage struct {
	Cars        []Car
	CountOfCars int
	Prices      PriceData
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
	MapID     string `json:"MapID"`
	Rounds    string `json:"Rounds"`
	HP        bool   `json:"Hp"`
	Collision bool   `json:"Col"`
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
	MapID      string
	MapPreview []PreviewData
}

type PreviewData struct {
	CellPath string
}

type GameMap struct {
	GameArea [225]CellsData
}

type CellsData struct {
	CellInfo string
}

type Account struct {
	ImgPath  string
	Nickname string
	Lvl      string
	Bosses   string
	Friends  []*FriendsData
}

type FriendsData struct {
	Nickname string `db:"nickname"`
}
