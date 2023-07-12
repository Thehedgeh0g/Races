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
  if (message == window.location.pathname.split('/')[2]) {
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

};

socket.addEventListener("open", (event) => {

  var message = window.location.pathname.split('/')[2]

  var data = {
    Message: message
  };

  socket.send(JSON.stringify(data.Message));
});

