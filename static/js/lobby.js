const triangle = document.getElementById('triangle');
const list = document.getElementById('list');

let flag = false;

triangle.addEventListener('click', mapList);

function mapList() {
    if (!flag) {
        list.style.height = '35vh';
        triangle.src="/static/sprites/triangle.png"
        flag = true;
    } else {
        list.style.height = '0vh';
        triangle.src="/static/sprites/triangle.png"
        flag = false;
    }
    
}

let numberOfChildren = list.children.length;

let chosenMap = 'm1'

const map = [];

function choosen(event) {
    console.log(event.currentTarget.id);
    chosenMap = event.currentTarget.id;
    console.log(chosenMap);
    for (let i = 1; i <= numberOfChildren; i++) {
        if ('m'+String(i) === chosenMap) {
            document.getElementById('m'+String(i)).style.background = "#ffdb7f";
        } else {
            document.getElementById('m'+String(i)).style.background = "#ffe6bf";
        }
    }
}

document.getElementById("button").addEventListener("click", function() {
    var xhr = new XMLHttpRequest();
   // var lobbyId = response.lobbyId
    xhr.open("POST", "/api/chooseMap");
    xhr.send(chosenMap.slice(1, 0));
    
    xhr.addEventListener("load", () =>{
        console.log(xhr.responseText.substring(12, 18))
        window.location.href = "/lobby/" + xhr.responseText.substring(12, 17)
    })
});