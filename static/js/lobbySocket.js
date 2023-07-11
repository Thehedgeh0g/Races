
let socketPath = "ws://localhost:3000/lobby/" + window.localStorage.getItem("lobbyID")

var socket = new WebSocket(socketPath);

socket.onmessage = function(event) {
  if (event.data === "update lobby") {
    // Обновляем страницу лобби
    location.reload();
  }
};
