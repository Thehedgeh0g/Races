const carousel = document.getElementById("carousel");
const designField = document.querySelector('.design-field');
const createMap = document.getElementById("CreateMap");
const menuButton = document.querySelector('.menu-button');
const borderPoints = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ,14, 15, 16, 30, 31, 45, 46, 60, 61, 75, 76, 90, 91, 105, 106, 120, 121, 135, 136, 150, 151, 165, 166, 180, 181, 195, 196, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225];
const checkTilesId = [31, 32, 33, 34, 35, 36];
const necessaryGrassPoints = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 32, 44, 47, 59, 62, 74, 77, 89, 92, 104, 107, 119, 122, 134, 137, 149, 152, 164, 167, 179, 182, 194, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209];
const grassTilesId = [1, 2, 3, 4];
const finalTileId = 37;
let flagId;
const achive = document.getElementById("achive");
const achiveImg = document.getElementById("achive__img");
const achiveTitle = document.getElementById("achive__title");
const achiveSubtitle = document.getElementById("achive__subtitle");
const achiveSteps = document.getElementById("achive__steps");

function showAchive(imgSrc, title, subtitle, steps) {
    achiveImg.src = imgSrc;
    achiveTitle.innerHTML = title;
    achiveSubtitle.innerHTML = subtitle;
    achiveSteps.innerHTML = steps;
    achive.style.width = "46vw";
    achive.style.borderWidth = "13px";
    setTimeout(removeAchive, 5000);
}

function removeAchive() {
    achive.style.width = "0vw";
    achive.style.borderWidth = "0px";
}

function getAchive(achivmentID) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', "/api/getAchivment");
    xhr.send(JSON.stringify(achivmentID));
    xhr.addEventListener('load', () => {
    let resp = JSON.parse(xhr.response);
    console.log(xhr.response);
    if(resp.achivment.AchivmentPath != "") {
        showAchive(resp.achivment.AchivmentPath, resp.achivment.Achivment, resp.achivment.AchivmentCom, resp.achivment.AchivmentDesc);
    }
    }); 
}


function loadPuzzles() {

    const xhr = new XMLHttpRequest();
    
    xhr.open('GET', "/api/getSprites");
    xhr.send()
    xhr.addEventListener('load', () => {
        let arPzl = JSON.parse(xhr.responseText);
        setListOfPuzzles(arPzl);
        selectedPuzzle();
        fillDesignField(); 
    });
  
  
    xhr.addEventListener('error', () => {
        console.log('error');
    });

}

let musicOff = true;
document.body.addEventListener("mousemove", playMusic);
document.body.addEventListener("canplaythrough", playMusic);

function playMusic(){
  if (musicOff){
    musicOff = false;
    let audio = new Audio();
    var musicFolder = '../static/music/editor/';
    var music = new Array('fur21.mp3', 'fur22.mp3', 'fur23.mp3');
    var rand_file_index = Math.round(Math.random()*(music.length-1));
    var rand_file_name = music[rand_file_index];
    console.log(rand_file_name);
    audio.src = musicFolder + rand_file_name;
    audio.play();
  }
}

loadPuzzles();



function setListOfPuzzles(arr) {
    let ulList = carousel.querySelector('.gallery__ul');

    for (let i = 0; i < arr.Sprites.length; i++) {
        let listEl = document.createElement('li');
        let pzl = document.createElement('img');
        pzl.src = `../static/map tiles sprites/${arr.Sprites[i]}.png`;
        pzl.id = i+1;
        listEl.append(pzl);
        ulList.append(listEl);
    } 
}


function selectedPuzzle() {
    let ulList = carousel.querySelectorAll('.gallery__ul li img');   
    for (let i=0; i < ulList.length; i++) {
        ulList[i].addEventListener("click", function () {
            flagId = document.getElementById(this.id);
        });
    }
}


function fillDesignField() {
    
    for (let i = 0; i < 225; i++) {
        let pzl = document.createElement('img');
        pzl.className = "tile"
        pzl.style.width = '100%';
        pzl.style.height = '100%';
        
        if (borderPoints.includes(i+1)) {
            pzl.src = '../static/map tiles sprites/BBB.png';
            pzl.id = `${i+1}-12`;
        } else {
            pzl.src = '../static/map tiles sprites/NE0.png';
            pzl.id = `${i+1}-1`;
            pzl.addEventListener("click", function() {
                if (flagId) {
                    let iD = this.id;
                    if (!necessaryGrassPoints.includes(parseInt(iD.split('-')[0]))) {
                        this.id = `${iD.split('-')[0]}-${flagId.id}`;
                        this.src = flagId.src;
                    } else {
                        if (grassTilesId.includes(parseInt(flagId.id))) {
                            this.id = `${iD.split('-')[0]}-${flagId.id}`;
                            this.src = flagId.src;
                        } else
                            alert('По краям карты допустимы только непроезжие фрагменты (трава, песок и т.д.)');
                    }
                }
            });
        }
        designField.append(pzl);
    }
}


createMap.addEventListener("click", saveMap);

function sendMap(val) {
    let data = { map: val };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', "/api/recordKey");
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.addEventListener('load', () => {
        getAchive('15');
    });

    xhr.addEventListener('error', () => {
        console.log('error');
    });

    xhr.send(JSON.stringify(data.map));
}


function saveMap() {
    let field = document.querySelectorAll('.tile');
    let isStartTile = false;
    let isCheckPoint = false;

    if (flagId) {
        let tilesString = '';
        for (let i=0; i < field.length; i++) {
            let iD = field[i].id;
            if (iD.split('-')[1] == finalTileId)
                isStartTile = true;
            if (checkTilesId.includes(parseInt(iD.split('-')[1])))
                isCheckPoint = true;
            tilesString += iD.split('-')[1] + ' ';
        }

        if (!isCheckPoint)
            alert('Добавьте фрагмент чекпоинта!');
        if (!isStartTile)
            alert('Добавьте фрагмент старта(финиша)!');
        if (isStartTile && isCheckPoint) {
            sendMap(tilesString); 
        }
            
    } else {
        alert('Заполните поле!');
    }

}

menuButton.addEventListener("click", () => 
   window.location.href = "menu"
)


