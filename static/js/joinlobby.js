const JoinButton = document.getElementById("JoinButton");
const formJoinLobby = document.getElementById("formJoinLobby"); 
const JoinLobbyBox = document.getElementById("JoinLobbyBox");
const CloseButtonJoinLobby = document.getElementById("CloseButtonJoinLobby");

JoinButton.addEventListener("click", showButtonAndDarkScreen)


function showButtonAndDarkScreen() {
  handleJoinButtonClick();
  darkenScreen();
}

function handleJoinButtonClick() {
  document.querySelector(".input-join-lobby").style.visibility = "visible";
  console.log('1');
}

formJoinLobby.addEventListener("submit", function() {
  handleTokenInputSubmit(event);
})

function handleTokenInputSubmit(event) {
  console.log('2');
  // Получаем значение введенного токена
  let token = document.getElementById("tokenInput").value;
  event.preventDefault();

  if (token === "124") {
    window.location.href = "___.html";
  } else {
      alert("Неверный токен. Пожалуйста, попробуйте еще раз.");
      document.getElementById("tokenInput").value = '';
  }
}

let overlay = document.createElement("div");

function darkenScreen() {
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);
}

CloseButtonJoinLobby.addEventListener("click", function() {
  document.body.removeChild(overlay);
  document.querySelector(".input-join-lobby").style.visibility = "hidden";
  //JoinButton.removeEventListener("click", showButtonAndDarkScreen)
})

