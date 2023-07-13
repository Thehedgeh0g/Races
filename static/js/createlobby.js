document.getElementById("CreateLobby").addEventListener("click", function() {
    var xhr = new XMLHttpRequest();
   // var lobbyId = response.lobbyId
    xhr.open("POST", "/api/create");
    xhr.send();
    
    xhr.addEventListener("load", () =>{
        console.log(xhr.responseText.substring(12, 18))
        window.localStorage.setItem("lobbyID", xhr.responseText.substring(12, 18))
        window.location.href = "/lobby/" + xhr.responseText.substring(12, 17)
    })
});