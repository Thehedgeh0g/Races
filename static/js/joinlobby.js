const JoinButton = document.getElementById("JoinButton");
const formJoinLobby = document.getElementById("formJoinLobby"); 
const JoinLobbyBox = document.getElementById("JoinLobbyBox");
const CloseButtonJoinLobby = document.getElementById("CloseButtonJoinLobby");
const ConnectLobbyButton = document.getElementById("ConnectLobbyButton");

JoinButton.addEventListener("click", showButtonAndDarkScreen);

ConnectLobbyButton.addEventListener("click", function() {
  handleTokenInputSubmit(event);
})

function changeBorderColor() {
  ConnectLobbyButton.style.border = "0.3vh solid yellow";
}

function returnBorderColor() {
  ConnectLobbyButton.style.border = "0.3vh solid #a88312";
}

ConnectLobbyButton.addEventListener("mouseover", changeBorderColor);
ConnectLobbyButton.addEventListener("mouseout", returnBorderColor);

formJoinLobby.addEventListener("submit", function() {
  handleTokenInputSubmit(event);
})

ConnectLobbyButton.addEventListener("click", function() {
  handleTokenInputSubmit(event);
})

function showButtonAndDarkScreen() {
  handleJoinButtonClick();
  darkenScreen();
}

function handleJoinButtonClick() {
  document.querySelector(".input-join-lobby").style.visibility = "visible";
  console.log('1');
}


function handleTokenInputSubmit(event) {

  let token = document.getElementById("tokenInput").value;
  event.preventDefault();
  const tokenData = JSON.stringify(token);
  getIdLobby(tokenData);
}

let overlay = document.createElement("div");

function darkenScreen() {
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);
}

CloseButtonJoinLobby.addEventListener("click", function() {
  document.body.removeChild(overlay);
  document.querySelector(".input-join-lobby").style.visibility = "hidden";
})

function getIdLobby(idLobby) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', "/api/join");
  xhr.addEventListener('load', () => {
    const response = JSON.parse(xhr.responseText);
    cb(response);
  });


  xhr.addEventListener('error', () => {
    console.log('error');
  });

  xhr.send(idLobby);
}