document.getElementById("CreateLobby").addEventListener("click", function() {
    var xhr = new XMLHttpRequest();
    var lobbyId = response.lobbyId
    xhr.open("POST", "/api/create");
    xhr.send();
    
    window.Location.href = "/lobby/" + lobbyId
});