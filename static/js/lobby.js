const triangle = document.getElementById("triangle");
const list = document.getElementById("list");

let flag = false;

let MapSettings = {
  MapID: "",
  Rounds: "",
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

let numberOfChildren = list.children.length;

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

var xhr1 = new XMLHttpRequest();
// var lobbyId = response.lobbyId
xhr1.open("GET", "/api/getHost");
xhr1.send();

xhr1.addEventListener("load", () => {
  let response = JSON.parse(xhr1.responseText);
  console.log(response);
  if (response.Host) {
    triangle.addEventListener("click", mapList);
    button.addEventListener("click", function () {
      if (
        document.getElementById("ready-0").innerHTML == "host" &&
        document.getElementById("ready-1").innerHTML == "ready" &&
        document.getElementById("ready-2").innerHTML == "ready" &&
        document.getElementById("ready-3").innerHTML == "ready"
      ) {
        let id = chosenMap.slice(1);
        console.log(id);
        var xhr = new XMLHttpRequest();
        // var lobbyId = response.lobbyId
        xhr.open("POST", "/api/chooseMap");
        MapSettings.MapID = id;
        MapSettings.Rounds = document.getElementById("rounds").value;
        xhr.send(JSON.stringify(MapSettings));

        xhr.addEventListener("load", () => {
          //console.log(xhr.responseText.substring(12, 18))

          var message = window.location.pathname.split("/")[2] + " start";
          console.log(message);
          var data = {
            Message: message,
          };

          socket.send(JSON.stringify(data.Message));
        });
      } else {
        if (document.getElementById("ready-1").innerHTML != "ready") {
          document.getElementById("ready-1").classList.add("rotor");
          document
            .getElementById("ready-1")
            .addEventListener("animationend", () => {
              document.getElementById("ready-1").classList.remove("rotor");
            });
        }
        if (document.getElementById("ready-2").innerHTML != "ready") {
          document.getElementById("ready-2").classList.add("rotor");
          document
            .getElementById("ready-2")
            .addEventListener("animationend", () => {
              document.getElementById("ready-2").classList.remove("rotor");
            });
        }
        if (document.getElementById("ready-3").innerHTML != "ready") {
          document.getElementById("ready-3").classList.add("rotor");
          document
            .getElementById("ready-3")
            .addEventListener("animationend", () => {
              document.getElementById("ready-3").classList.remove("rotor");
            });
        }
      }
    });
  } else {
    document.getElementById("settings").style.backgroundColor = "#6e6a5d";
    document.getElementById("settings").innerHTML =
      "Only host can change settings";
    document.getElementById("settings").style.justifyContent = "center";
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
      var message =
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
    var message =
    window.location.pathname.split("/")[2] +
    " " +
    String(myID) +
    " " +
    String(ready);
    socket.send(JSON.stringify(message));



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
      lvl1.innerHTML = players.User[0].Level + "lvl";
      avatar2.src = players.User[1].ImgPath;
      nickName2.innerHTML = players.User[1].Nickname;
      lvl2.innerHTML = players.User[1].Level + "lvl";
      avatar3.src = players.User[2].ImgPath;
      nickName3.innerHTML = players.User[2].Nickname;
      lvl3.innerHTML = players.User[2].Level + "lvl";
      avatar4.src = players.User[3].ImgPath;
      nickName4.innerHTML = players.User[3].Nickname;
      lvl4.innerHTML = players.User[3].Level + "lvl";
      if (nickName1.innerHTML != "Empty") {
        document.getElementById("player-1").style.display = "flex";
        document.getElementById("ready-0").innerHTML = "host";
      }
      if (nickName2.innerHTML != "Empty") {
        document.getElementById("player-2").style.display = "flex";
        document.getElementById("ready-1").innerHTML = "not ready";
      }
      if (nickName3.innerHTML != "Empty") {
        document.getElementById("player-3").style.display = "flex";
        document.getElementById("ready-2").innerHTML = "not ready";
      }
      if (nickName4.innerHTML != "Empty") {
        document.getElementById("player-4").style.display = "flex";
        document.getElementById("ready-3").innerHTML = "not ready";
      }
    });
  } else {
    if (message == window.location.pathname.split("/")[2] + " start") {
      window.location.href = "/race/" + window.location.pathname.split("/")[2];
    } else {
      id = message.split(" ")[1];
      console.log(id);
      let readyText = null;
      if (id == "0") {
        readyText = document.getElementById("ready-0");
      }
      if (id == "1") {
        readyText = document.getElementById("ready-1");
      }
      if (id == "2") {
        readyText = document.getElementById("ready-2");
      }
      if (id == "3") {
        readyText = document.getElementById("ready-3");
      }
      if (message.split(" ")[2] == "true") {
        readyText.innerHTML = "ready";
        readyText.style.backgroundColor = "#d2ffc8";
      } else {
        readyText.innerHTML = "not ready";
        readyText.style.backgroundColor = "#eb9054";
      }
    }
  }
};

socket.addEventListener("open", (event) => {
  var message = window.location.pathname.split("/")[2] + " reboot";

  socket.send(JSON.stringify(message));
});

const collision = document.getElementById("collision-input");
const hp = document.getElementById("hp-input");

const collisionDot = document.getElementById("col-dot");
const hpDot = document.getElementById("hp-dot");

let isCollision = false;
let isHp = false;

collision.addEventListener("click", switchCollision);
hp.addEventListener("click", switchHp);

function switchCollision() {
  if (isCollision) {
    collisionDot.style.visibility = "hidden";
    isCollision = false;
  } else {
    collisionDot.style.visibility = "visible";
    isCollision = true;
  }
}

function switchHp() {
  if (isHp) {
    hpDot.style.visibility = "hidden";
    isHp = false;
  } else {
    hpDot.style.visibility = "visible";
    isHp = true;
  }
}
const token = document.getElementById("token");
const copy = document.getElementById("copy");
copy.addEventListener("click", () => {
  navigator.clipboard.writeText(token.innerHTML.slice(6));
  copy.innerHTML = "Copied";
});
