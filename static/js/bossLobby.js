const triangle = document.getElementById("triangle");
const list = document.getElementById("list");

let flag = false;

let MapSettings = {
  MapID: "",
  Rounds: "",
  Hp: null,
  Col: null,
};

function mapList() {
  if (!flag) {
    list.style.height = "55vh";
    triangle.src = "/static/sprites/triangle2.png";
    flag = true;
  } else {
    list.style.height = "0vh";
    triangle.src = "/static/sprites/triangle.png";
    flag = false;
  }
}

let musicOff = true;
document.body.addEventListener("mousemove", playMusic);
document.body.addEventListener("canplaythrough", playMusic);

function playMusic(){
  if (musicOff){
    musicOff = false;
    let audio = new Audio();
    var musicFolder = '../static/music/lobby/';
    var music = new Array('InitialD-DontYouWannaBeFree_(muzmo.su).mp3', 'InitialD-LoveMoney.mp3', 'InitialD-RageYourDream_(muzmo.su).mp3');
    var rand_file_index = Math.round(Math.random()*(music.length-1));
    var rand_file_name = music[rand_file_index];
    console.log(rand_file_name);
    audio.src = musicFolder + rand_file_name;
    audio.play();
  }
}

let chosenMap = "m1";

const map = [];

function choosen(event) {
  console.log(event.currentTarget.id);
  chosenMap = event.currentTarget.id;
  console.log(chosenMap);
  for (let i = 1; i <= numberOfChildren; i++) {
    if ("m" + String(i) === chosenMap) {
      document.getElementById("m" + String(i)).style.background = "#ffdb7f";
    } else {
      document.getElementById("m" + String(i)).style.background = "#ffe6bf";
    }
  }

  var message =
    window.location.pathname.split("/")[2] +
    " " +
    "map" +
    " " +
    String(chosenMap);
  console.log(message);
  socket.send(JSON.stringify(message));
}

const button = document.getElementById("button");

button.addEventListener("mousedown", () => {
  button.classList.add("pressed");
});
button.addEventListener("mouseup", () => {
  button.classList.remove("pressed");
});
button.addEventListener("mouseleave", () => {
  button.classList.remove("pressed");
});
const choose = document.getElementById("choose");
const settings = document.getElementById("settings");

let ready = false;

let isHost = true;
var xhr1 = new XMLHttpRequest();
// var lobbyId = response.lobbyId
xhr1.open("GET", "/api/getHost");
xhr1.send();

xhr1.addEventListener("load", () => {
  let response = JSON.parse(xhr1.responseText);
  console.log(response);
  if (response.Host) {
    button.addEventListener("click", function () {
      let id = chosenMap.slice(1);
      console.log(id);
      var xhr = new XMLHttpRequest();
      // var lobbyId = response.lobbyId
      xhr.open("POST", "/api/chooseMap");
      MapSettings.MapID = id;
      MapSettings.Rounds = 1;
      MapSettings.Hp = isHp;
      MapSettings.Col = isCollision;
      xhr.send(JSON.stringify(MapSettings));

      xhr.addEventListener("load", () => {
        //console.log(xhr.responseText.substring(12, 18))

        var message = window.location.pathname.split("/")[2] + " start";
        console.log(message);

        socket.send(JSON.stringify(message));
      });
    });
  } else {
    isHost = false;
    document.getElementById("inner-settings").style.display = "none";
    document.getElementById("future-map").innerHTML =
      document.getElementById(chosenMap).innerHTML;
    document.getElementById("settings").style.padding = "30px";
    document.getElementById("button-text").innerHTML = "NOT READY";
    button.style.backgroundColor = "#eb9054";
    button.addEventListener("click", () => {
      if (ready) {
        ready = false;
        button.style.backgroundColor = "#eb9054";
        document.getElementById("button-text").innerHTML = "NOT READY";
      } else {
        ready = true;
        button.style.backgroundColor = "#d2ffc8";
        document.getElementById("button-text").innerHTML = "READY";
      }
      let message =
        window.location.pathname.split("/")[2] +
        " " +
        String(myID) +
        " " +
        String(ready);

      socket.send(JSON.stringify(message));
    });
  }
});

const avatar1 = document.getElementById("avatar1");
const nickName1 = document.getElementById("nickName1");
const lvl1 = document.getElementById("lvl1");
const avatar2 = document.getElementById("avatar2");
const nickName2 = document.getElementById("nickName2");
const lvl2 = document.getElementById("lvl2");
const avatar3 = document.getElementById("avatar3");
const nickName3 = document.getElementById("nickName3");
const lvl3 = document.getElementById("lvl3");
const avatar4 = document.getElementById("avatar4");
const nickName4 = document.getElementById("nickName4");
const lvl4 = document.getElementById("lvl4");

let myID = 0;

var socket = new WebSocket("wss:" + window.location.hostname + "/ws");

socket.onmessage = function (event) {
  var message = JSON.parse(event.data);
  console.log(message);
  if (message.split(" ")[1] == "reboot") {
    if (isHost) {
      var message =
        window.location.pathname.split("/")[2] +
        " " +
        "map" +
        " " +
        String(chosenMap);
      console.log(message);
      socket.send(JSON.stringify(message));
    }
    var xhr = new XMLHttpRequest();
    // var lobbyId = response.lobbyId

    xhr.open("GET", "/api/getPlayers");
    xhr.send();

    xhr.addEventListener("load", () => {
      let players = JSON.parse(xhr.responseText);
      console.log(players);
      console.log(players.User);
      myID = players.Id;
      avatar1.src = players.User[0].ImgPath;
      nickName1.innerHTML = players.User[0].Nickname;
      lvl1.innerHTML = players.User[0].Lvl + "lvl";
      avatar2.src = players.User[1].ImgPath;
      nickName2.innerHTML = players.User[1].Nickname;
      if (nickName1.innerHTML != "Empty") {
        document.getElementById("player-1").style.display = "flex";
      }
      if (nickName2.innerHTML != "Empty") {
        document.getElementById("player-2").style.display = "flex";
      }
      var message =
        window.location.pathname.split("/")[2] +
        " " +
        String(myID) +
        " " +
        String(ready);
      socket.send(JSON.stringify(message));
    });
  } else {
    if (message == window.location.pathname.split("/")[2] + " start") {
      window.location.href = "/race/" + window.location.pathname.split("/")[2];
    }
  }
};

socket.addEventListener("open", (event) => {
  var message = window.location.pathname.split("/")[2] + " reboot";
  socket.send(JSON.stringify(message));
});

function sendChatMess(event) {
  event.preventDefault();
  if (myID == 0) {
    var message =
      window.location.pathname.split("/")[2] +
      " " +
      "message" +
      " |" +
      String(document.getElementById("nickName1").innerHTML) +
      ": " +
      String(document.getElementById("chat-field").value);
  }
  if (myID == 1) {
    var message =
      window.location.pathname.split("/")[2] +
      " " +
      "message" +
      " |" +
      String(document.getElementById("nickName2").innerHTML) +
      ": " +
      String(document.getElementById("chat-field").value);
  }
  if (myID == 2) {
    var message =
      window.location.pathname.split("/")[2] +
      " " +
      "message" +
      " |" +
      String(document.getElementById("nickName3").innerHTML) +
      ": " +
      String(document.getElementById("chat-field").value);
  }
  if (myID == 3) {
    var message =
      window.location.pathname.split("/")[2] +
      " " +
      "message" +
      " |" +
      String(document.getElementById("nickName4").innerHTML) +
      ": " +
      String(document.getElementById("chat-field").value);
  }
  document.getElementById("chat-field").value = "";
  socket.send(JSON.stringify(message));
}

const collision = document.getElementById("collision-input");
const hp = document.getElementById("hp-input");

const collisionDot = document.getElementById("col-dot");
const hpDot = document.getElementById("hp-dot");

let isCollision = false;
let isHp = false;

function switchCollision() {
  if (isCollision) {
    collisionDot.style.visibility = "hidden";
    isCollision = false;
  } else {
    collisionDot.style.visibility = "visible";
    isCollision = true;
  }
  sendCol();
}

function sendCol() {
  let message =
    window.location.pathname.split("/")[2] +
    " " +
    "col" +
    " " +
    String(isCollision);
  socket.send(JSON.stringify(message));
}

function switchHp() {
  if (isHp) {
    hpDot.style.visibility = "hidden";
    isHp = false;
  } else {
    hpDot.style.visibility = "visible";
    isHp = true;
  }
  sendHp();
}

function sendHp() {
  let message =
    window.location.pathname.split("/")[2] + " " + "hp" + " " + String(isHp);
  socket.send(JSON.stringify(message));
}

const token = document.getElementById("token");
const copy = document.getElementById("copy");

const BackToMenu = document.getElementById("menu");

BackToMenu.addEventListener('click', ()=> {
  window.location.href = "/menu"
});

