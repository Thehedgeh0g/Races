const achive = document.getElementById("achive");
const achiveImg = document.getElementById("achive__img");
const achiveTitle = document.getElementById("achive__title");
const achiveSubtitle = document.getElementById("achive__subtitle");
const achiveSteps = document.getElementById("achive__steps");

let musicOff = true;
document.body.addEventListener("mousemove", playMusic);
document.body.addEventListener("canplaythrough", playMusic);

function playMusic(){
  if (musicOff){
    musicOff = false;
    let audio = new Audio();
    var musicFolder = '../static/music/';
    var music = new Array('InitialD-LoveMoney.mp3','InitialD-SpeedySpeedBoy.mp3','InitialD-DejaVu.mp3','InitialD-Spitfire_(muzmo.su).mp3', 'InitialD-RageYourDream_(muzmo.su).mp3', 'need_for_speed_most_wanted_07 - Hush-Fired up.mp3', 'need_for_speed_most_wanted_04 - Suni Clay - In A Hood Near You.mp3', 'need_for_speed_most_wanted_03 - Rock - I Am Rock.mp3', 'need_for_speed_most_wanted_01 - Styles of Beyond - Nine Thou (Superstars Remix).mp3', 'need_for_speed_underground_2_1. Snoop Dogg ft The Doors - Riders on the Storm(fredwreck remix).mp3', 'INITIAL-D_(muzmo.su).mp3', 'need_for_speed_carbon_06.Gary Numan & Tubeway Army - Are Friends Electric.mp3');
    var rand_file_index = Math.round(Math.random()*(music.length-1));
    var rand_file_name = music[rand_file_index];
    console.log(rand_file_name);
    audio.src = musicFolder + rand_file_name;
    audio.loop = true;
    audio.play();
  }
}

function showAchive(imgSrc, title, subtitle, steps) {
  achiveImg.src = imgSrc;
  achiveTitle.innerHTML = title;
  achiveSubtitle.innerHTML = subtitle;
  achiveSteps.innerHTML = steps;
  achive.style.width = "45vw";
  achive.style.borderWidth = "15px";
  setTimeout(removeAchive, 5000);
}

function removeAchive() {
  achive.style.width = "0vw";
  achive.style.borderWidth = "0px";
}

function getAchive(achivmentID) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', "/api/getAchivment");
    xhr.addEventListener('load', () => {
      let resp = JSON.parse(xhr.response);
      if(resp.achivment.AchivmentPath != "") {
          
          showAchive(resp.achivment.AchivmentPath, resp.achivment.Achivment, resp.achivment.AchivmentCom, resp.achivment.AchivmentDesc);
      }
    });
    xhr.send(JSON.stringify(achivmentID));
}


