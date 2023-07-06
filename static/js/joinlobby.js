const JoinButton = document.getElementById("JoinButton");
const formJoinLobby = document.getElementById("formJoinLobby"); 
const JoinLobbyBox = document.getElementById("JoinLobbyBox");

JoinButton.addEventListener("click", function() {
  handleJoinButtonClick();
})

function handleJoinButtonClick() {
  document.querySelector(".input-join-lobby").style.visibility = "visible";
  console.log('1');
}

formJoinLobby.addEventListener("submit", function() {
  handleTokenInputSubmit(event)
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