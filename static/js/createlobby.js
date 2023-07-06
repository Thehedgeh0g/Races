document.getElementById("CreateLobby").addEventListener("click", function() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/create");
    xhr.send(null);
});