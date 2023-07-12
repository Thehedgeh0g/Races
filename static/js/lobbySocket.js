
var socket = new WebSocket("ws:/localhost:3000/ws");

socket.onmessage = function(event) {
  var message = JSON.parse(event.data);
  if (message == window.location.pathname.split('/')[2]) {
      var xhr = new XMLHttpRequest();
      // var lobbyId = response.lobbyId
      xhr.open("GET", "/api/getPlayers");
      xhr.send();
      
      xhr.addEventListener("load", () =>{
          console.log(JSON.parse(xhr.responseText))
        
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
