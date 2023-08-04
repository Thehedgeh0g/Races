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

function showButtonAndDarkScreen() {
  handleJoinButtonClick();
  darkenScreen();
}

function handleJoinButtonClick() {
  document.querySelector(".input-join-lobby").style.visibility = "visible";
  console.log('1');

  let xhr = new XMLHttpRequest();
  xhr.open('GET', "/api/getLobbyList");
  xhr.send();
  xhr.addEventListener('load', () => {
    response = JSON.parse(xhr.responseText)
    console.log(response)
    const list = document.getElementById("lobby-list")
    list.innerHTML = "";
    for (let i = 0; i < response.LobbyList.length; i++) {
      list.innerHTML = list.innerHTML +
      `
      <div class="friend">
        <img src="` + response.LobbyList[i].Friend.Avatar + `" class="small-ava">
        <div class="col">
          <span>` + response.LobbyList[i].Friend.Nickname + `</span>
          <span>lvl:` + (response.LobbyList[i].Friend.Lvl - response.LobbyList[i].Friend.Lvl % 100) / 100 + `</span>
        </div>
        <button class="connect-friend" id="Connect`+ response.LobbyList[i].LobbyID +`" onclick="handleTokenInputSubmitByFriend(id)">connect</button>
      </div>
      `
    } 
  })
}


function handleTokenInputSubmit(event) {

  let token = document.getElementById("tokenInput").value;
  event.preventDefault();
  const tokenData = JSON.stringify(token);
  getIdLobby(tokenData);
}

function handleTokenInputSubmitByFriend(id) {
  id = id.slice(7);
  const idData = JSON.stringify(id);
  getIdLobby(idData);
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
    console.log(xhr.responseText)
    window.localStorage.setItem("lobbyID", xhr.responseText.substring(12, 17))
    if (JSON.parse(xhr.responseText).error == "") {
      window.location.href = "/lobby/" + idLobby.split('"')[1]
    }
  });


  xhr.addEventListener('error', () => {
    console.log('error');
  });

  xhr.send(idLobby);
}