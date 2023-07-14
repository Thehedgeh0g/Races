const triangle = document.getElementById('triangle');
const list = document.getElementById('list');

let flag = false;



function mapList() {
    if (!flag) {
        list.style.height = '35vh';
        triangle.src="/static/sprites/triangle2.png"
        flag = true;
    } else {
        list.style.height = '0vh';
        triangle.src="/static/sprites/triangle.png"
        flag = false;
    }
    
}

let numberOfChildren = list.children.length;

let chosenMap = 'm1'

const map = [];

function choosen(event) {
    console.log(event.currentTarget.id);
    chosenMap = event.currentTarget.id;
    console.log(chosenMap);
    for (let i = 1; i <= numberOfChildren; i++) {
        if ('m'+String(i) === chosenMap) {
            document.getElementById('m'+String(i)).style.background = "#ffdb7f";
        } else {
            document.getElementById('m'+String(i)).style.background = "#ffe6bf";
        }
    }
}


const choose = document.getElementById("choose");
const settings = document.getElementById("settings");

var xhr1 = new XMLHttpRequest();
// var lobbyId = response.lobbyId
xhr1.open("GET", "/api/getHost");
xhr1.send();

xhr1.addEventListener("load", () =>{ 
    let response = JSON.parse(xhr1.responseText);
    console.log(response);
    if (response.Host) {
        triangle.addEventListener('click', mapList);
        document.getElementById("button").addEventListener("click", function() {
            let id = chosenMap.slice(1);
            console.log(id);
            var xhr = new XMLHttpRequest();
           // var lobbyId = response.lobbyId
            xhr.open("POST", "/api/chooseMap");
            xhr.send(JSON.stringify(id));
            
            xhr.addEventListener("load", () =>{
                //console.log(xhr.responseText.substring(12, 18))
        
                var message = window.location.pathname.split('/')[2] + ' start'
                console.log(message)
                var data = {
                  Message: message
                };
              
                socket.send(JSON.stringify(data.Message));
            })
        });
    } else {
        document.getElementById("button").style.backgroundColor = '#6e6a5d';
        document.getElementById("settings").style.backgroundColor = '#6e6a5d';
        document.getElementById("maps").style.backgroundColor = '#6e6a5d';
        document.getElementById("button-text").innerHTML = "Only host can start a game";
        choose.innerHTML = "Only host can choose a map";
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

var socket = new WebSocket("ws:/localhost:3000/ws");

socket.onmessage = function(event) {
  var message = JSON.parse(event.data);
  console.log(message)
  if (true) {
      var xhr = new XMLHttpRequest();
      // var lobbyId = response.lobbyId
      xhr.open("GET", "/api/getPlayers");
      xhr.send();
      
      xhr.addEventListener("load", () =>{
          
          let players = JSON.parse(xhr.responseText);
          console.log(players);
          console.log(players.User);
          avatar1.src = players.User[0].ImgPath;
          nickName1.innerHTML = players.User[0].Nickname;
          lvl1.innerHTML = players.User[0].Level + 'lvl';
          avatar2.src = players.User[1].ImgPath;
          nickName2.innerHTML = players.User[1].Nickname;
          lvl2.innerHTML = players.User[1].Level + 'lvl';
          avatar3.src = players.User[2].ImgPath;
          nickName3.innerHTML = players.User[2].Nickname;
          lvl3.innerHTML = players.User[2].Level + 'lvl';
          avatar4.src = players.User[3].ImgPath;
          nickName4.innerHTML = players.User[3].Nickname;
          lvl4.innerHTML = players.User[3].Level + 'lvl';
      });
  }
  if (message == window.location.pathname.split('/')[2] + ' start') {
      window.location.href = "/race/" + window.location.pathname.split('/')[2];
  }


};

socket.addEventListener("open", (event) => {

  var message = window.location.pathname.split('/')[2] + ' reboot'

  var data = {
    Message: message
  };

  socket.send(JSON.stringify(data.Message));
});

