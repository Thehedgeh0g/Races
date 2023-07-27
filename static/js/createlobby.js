const button = document.getElementById("CreateLobby");
const box = document.getElementById("ChooseLobbyBox");
const cont = document.getElementById("cont");
const multi = document.getElementById("multi");
const boss = document.getElementById("boss");
overlay = document.createElement("div");

button.addEventListener("click", function() {
    // cont.style.visibility = "visible";
    darkenScreen();
    box.style.visibility = "visible"
});

multi.addEventListener("click", () => {
    var xhr = new XMLHttpRequest();
   // var lobbyId = response.lobbyId
    xhr.open("POST", "/api/create");
    xhr.send();
    
    xhr.addEventListener("load", () =>{
        console.log(xhr.responseText.split('"')[1])
        window.localStorage.setItem("lobbyID", xhr.responseText.substring(12, 18))
        window.location.href = "/lobby/" + xhr.responseText.split('"')[3]
    });
})

boss.addEventListener("click", () => {
    var xhr = new XMLHttpRequest();
   // var lobbyId = response.lobbyId
    xhr.open("POST", "/api/createBossLobby");
    xhr.send();
    
    xhr.addEventListener("load", () =>{
        console.log(xhr.responseText.split('"')[1])
        window.localStorage.setItem("lobbyID", xhr.responseText.substring(12, 18))
        window.location.href = "/bossLobby/" + xhr.responseText.split('"')[3]
    });
})

CloseButtonChooseLobby.addEventListener("click", function() {
    document.body.removeChild(overlay);
    box.style.visibility = "hidden";
  })

function darkenScreen() {
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);
}

