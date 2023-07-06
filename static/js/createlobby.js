document.getElementById("CreateLobby").addEventListener("click", function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/create");
});