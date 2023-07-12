
var path = getPath()

function getPath(){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', "/api/getLobbyID");
  xhr.send();
  xhr.addEventListener('load', () => {
    path = xhr.responseText.substring(11, 17)
    //console.log(path)
    return path
  });
}
var socket = new WebSocket("ws:/localhost:3000/ws");

socket.onmessage = function(event) {
  var message = JSON.parse(event.data);
  console.log(message)
  ("#body").load("lobbycreation.html #body");
};

socket.addEventListener("open", (event) => {
  console.log(getPath())
  var message = window.location.pathname

  var data = {
    Message: message
  };

  socket.send(JSON.stringify(data.Message));
});
