let curCar = 1;

let isLoaded = false;
let tiles = [];
let GAME = {
  width: 1440,
  height: 1440,
  background: "grey",
  framesCnt: 0,
};
let mcarspeed = 4;
let mrspeed = 0.03;
let rspeed = mrspeed;
let mspeed = mcarspeed;
let accel = mspeed / 160;
let breakes = accel;
let resist = accel / 4;
const pi1 = Math.PI;
const pi2 = 1 / 2;
const ga = 0.1;
const gs = mspeed / 5;
let canvas = document.getElementById("canvas");
let move = document.getElementById("move");
canvas.width = GAME.width;
canvas.height = GAME.height;
let canvasContext = canvas.getContext("2d");
canvasContext.imageSmoothingEnabled = false;
let Car = new Image();
let CarF = new Image();
let CarL = new Image();
let CarR = new Image();

var audioStart = new Audio();
audioStart.src = "../static/sounds/jiga2kStart.mp3";
audioStart.volume = 0.2;
var audioStay = new Audio();
audioStay.src = "../static/sounds/jiga hol2Stay.wav";
audioStay.volume = 0.2;
var audioGo = new Audio();
audioGo.src = "../static/sounds/jiga 3kGo2.wav";
audioGo.volume = 0.2;
var audioStop = new Audio();
audioStop.src = "../static/sounds/jiga 3kStop.mp3";
audioStop.volume = 0.1;
var audioTires = new Audio();
audioTires.src = "../static/sounds/tires.wav";
audioTires.volume = 0.2;
var audioEngineOn = new Audio();
audioEngineOn.src = "../static/sounds/jigasEngineOn.wav";
audioEngineOn.volume = 0.2;

let musicOff = true;
document.body.addEventListener("mousemove", playMusic);
document.body.addEventListener("canplaythrough", playMusic);

function playMusic(){
  if (musicOff){
    musicOff = false;
    let audio = new Audio();
    audio.volume = 0.3;
    var musicFolder = '../static/music/race/';
    var music = new Array('INITIAL-D_(muzmo.su).mp3', 'InitialD-GASGAS_(muzmo.su).mp3', 'InitialD-RunninginThe90s_(muzmo.su).mp3', 'InitialD-SpeedySpeedBoy.mp3', 'InitialD-Spitfire_(muzmo.su).mp3', 'need_for_speed_most_wanted_01 - Styles of Beyond - Nine Thou (Superstars Remix).mp3');
    var rand_file_index = Math.round(Math.random()*(music.length-1));
    var rand_file_name = music[rand_file_index];
    console.log(rand_file_name);
    audio.src = musicFolder + rand_file_name;
    audio.play();
  }
}

myCar = 0;
Car.src = "/static/sprites/AY.png";

const carW = 17;
const carH = 25;

let CarPosX = -carW * 0.5;
let CarPosY = -carH * 2 * 0;
let speed = 0;
let xspeed = 0;
let yspeed = 0;
let angle = 0;
let drawAngle = 0;

let xcanvas = 0;
let ycanvas = 0;

let wasd = {
  w: 0,
  a: 0,
  s: 0,
  d: 0,
  space: 0,
  r: 0,
};

const dial = document.getElementById("dial");

const r1 = document.getElementById("r1");
const r2 = document.getElementById("r2");
const r3 = document.getElementById("r3");
const r4 = document.getElementById("r4");

const grassArr = [1, 2, 3, 4];
const roadArr = [11, 10, 9, 8, 7, 6, 31, 32];
const BGtransArr = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 38, 39, 40, 41, 42];
const bRoadArr = [13, 14, 15, 16, 17, 18, 33, 34];
const borderArr = [12];

const startArr = ["37"];
const startStraightArr = ["37"];

let startingTile = 1;

let startX = 0;
let startY = 0;

let amountOfPlayers = 0;

let cars = [
  {
    Name: null,
    Img: null,
    Imag: null,
    X: null,
    Y: null,
    Angle: null,
    Ready: 0,
    Speed: null,
    Border: null,
    cflag: false,
    HP: 100,
  },
  {
    Name: null,
    Img: null,
    Imag: null,
    X: null,
    Y: null,
    Angle: null,
    Ready: 0,
    Speed: null,
    Border: null,
    cflag: false,
    HP: 100,
  },
  {
    Name: null,
    Img: null,
    Imag: null,
    X: null,
    Y: null,
    Angle: null,
    Ready: 0,
    Speed: null,
    Border: null,
    cflag: false,
    HP: 100,
  },
  {
    Name: null,
    Img: null,
    Imag: null,
    X: null,
    Y: null,
    Angle: null,
    Ready: 0,
    Speed: null,
    Border: null,
    cflag: false,
    HP: 10,
  },
];


let isHp = true;
let isCollision = true;

let y0 = 0;
let x0 = 0;
let y1 = 0;
let x1 = 0;

let ready = 0;

const mapdot = [];

mapdot[0] = document.getElementById("mapdot0");
mapdot[1] = document.getElementById("mapdot1");
mapdot[2] = document.getElementById("mapdot2");
mapdot[3] = document.getElementById("mapdot3");

console.log(mapdot);

let sflag = false;

const checkPointTiles = [31, 32, 33, 34, 35, 36];
let checkCounter = 0;
let maxCheck = 0;
const checks = document.getElementById("check");
var checkSound = new Audio('/static/sounds/beep-check.mp3');
checkSound.volume = 0.3;
var roundSound = new Audio('/static/sounds/beep-round.mp3');
roundSound.volume = 0.3;
var winSound = new Audio('/static/sounds/win.wav');
winSound.volume = 0.3;
var boomSound = new Audio('/static/sounds/boom.mp3');
boomSound.volume = 1;


let turnTiles = [];

let curRound = 1;

let maxRounds = 999;

const roundHTML = document.getElementById("round");

let finished = 0;

let table = {
  first: 4,
  second: 4,
  third: 4,
  forth: 4,
  is7: false,
  is8: false,
  is9: false,
  is10: false,
};

let endTime = new Date();

let dif = 0;

let sended = false;

const notification = document.getElementById("notification");

const waiting = document.getElementById("waiting");

const tabl = document.getElementById("table");

const name1 = document.getElementById("Name1");
const time1 = document.getElementById("Time1");
const name2 = document.getElementById("Name2");
const time2 = document.getElementById("Time2");
const name3 = document.getElementById("Name3");
const time3 = document.getElementById("Time3");
const name4 = document.getElementById("Name4");
const time4 = document.getElementById("Time4");

const exp = document.getElementById("exp");
const money = document.getElementById("money");

const button = document.getElementById("button");

let dif1 = 0;
let vzhoom = new Audio();
vzhoom.volume = 0.1;

let bar = [];

bar[0] = document.getElementById("bar0");
bar[1] = document.getElementById("bar1");
bar[2] = document.getElementById("bar2");
bar[3] = document.getElementById("bar3");

let barName = [];

barName[0] = document.getElementById("barName0");
barName[1] = document.getElementById("barName1");
barName[2] = document.getElementById("barName2");
barName[3] = document.getElementById("barName3");

let barHP = [];

barHP[0] = document.getElementById("barHP0");
barHP[1] = document.getElementById("barHP1");
barHP[2] = document.getElementById("barHP2");
barHP[3] = document.getElementById("barHP3");

anglep = Math.PI / 2 + 0.001;
function drawFrame() {
  setTimeout(() => {
    anglep = drawAngle;
    onCanvasKey();

    UpdatePosition();

    drawCar(Car, CarPosX, CarPosY);

    drawMapDots();

    endTime = new Date();
    dif = endTime - startTime;
    dif =
      String(divme((endTime - startTime) / 1000, 60)) +
      ":" +
      String(((endTime - startTime) / 1000) % 60);
    //console.log(dif);
    let curTime = new Date();
    dif1 = ((curTime - startTime) / 1000);
    if (dif1 < 5 && ready != 0) {
      document.getElementById("timer").innerHTML =
        "STARTING IN " + String(5 - dif1).slice(0, 4);
    }
    let h = wasd.r;
    if (dif1 > 5 && dif1 < 8 && ready != 0) {
      document.getElementById("timer").innerHTML = "GO";
      h = 2;
    }
    if (dif1 > 6 && ready != 0) {
      document.getElementById("timer").style.visibility = "hidden";
      h = 2;
    }

    dial.style.transform = "rotate(" + Math.abs(speed * 18) + "deg)";
    if (sflag == true) {
      var message =
        window.location.pathname.split("/")[2] +
        " race " +
        String(h) +
        "/" +
        String(speed) +
        " " +
        String(drawAngle) +
        " " +
        String(y0) +
        " " +
        String(x0) +
        " " +
        String(y1) +
        " " +
        String(x1) +
        " " +
        String(myCar) +
        " " +
        String(cars[myCar].HP) +
        " " +
        finished +
        "/" +
        dif;
      socket.send(JSON.stringify(message));
      //console.log(message);
    }

    requestAnimationFrame(drawFrame);
  }, 16);
}

function drawMapDots() {
  if (sflag) {
    for (let i = 0; i < amountOfPlayers; i++) {
      mapdot[i].style.display = "block";
      if (i == myCar) {
        mapdot[i].style.backgroundColor = "white";
      }
      mapdot[i].style.top = (cars[i].Y / 19.2) * 1.5 + "px";
      mapdot[i].style.left = (cars[i].X / 19.2) * 1.5 + "px";
    }
  }
}

function UpdatePosition() {
  if (CarPosY == 0 && wasd.space == 1) {
    CarPosY = -carH;
    canvasContext.translate(0, carH);

    // xcanvas += Math.sin(angle) * carH;
    // ycanvas += Math.cos(angle) * carH;

    console.log("WAH");
  }

  if (CarPosY == -carH && (wasd.space == 0 || Math.abs(speed) <= pi1)) {
    CarPosY = 0;
    canvasContext.translate(0, -carH);

    // xcanvas -= Math.sin(angle) * carH;
    // ycanvas -= Math.cos(angle) * carH;

    console.log("EHH");
  }

  bFlag = false;
  reduceSpeed();

  updateReduce();

  for (let i = 0; i < amountOfPlayers; i++) {
    if (i != myCar && isCollision) {
      if (
        checkCrosses(
          cars[myCar].Border,
          cars[i].Border.A[0],
          cars[i].Border.A[1]
        ) ||
        checkCrosses(
          cars[myCar].Border,
          cars[i].Border.B[0],
          cars[i].Border.B[1]
        ) ||
        checkCrosses(
          cars[myCar].Border,
          cars[i].Border.C[0],
          cars[i].Border.C[1]
        ) ||
        checkCrosses(
          cars[myCar].Border,
          cars[i].Border.D[0],
          cars[i].Border.D[1]
        ) ||
        checkCrosses(
          cars[i].Border,
          cars[myCar].Border.A[0],
          cars[myCar].Border.A[1]
        ) ||
        checkCrosses(
          cars[i].Border,
          cars[myCar].Border.B[0],
          cars[myCar].Border.B[1]
        ) ||
        checkCrosses(
          cars[i].Border,
          cars[myCar].Border.C[0],
          cars[myCar].Border.C[1]
        ) ||
        checkCrosses(
          cars[i].Border,
          cars[myCar].Border.D[0],
          cars[myCar].Border.D[1]
        )
      ) {
        if (!cars[i].cflag) {
          let angle1 = Number(cars[i].Angle);
          let speed1 = Number(cars[i].Speed);
          getAchive(4);
          console.log(angle % (Math.PI * 2), angle1 % (Math.PI * 2))
          if (
            (angle1 % (Math.PI * 2)) - Math.PI / 2 < angle % (Math.PI * 2) &&
            (angle1 % (Math.PI * 2)) + Math.PI / 2 > angle % (Math.PI * 2)
          ) {
            console.log('forw')
            speed = speed1;
          } else {
            if (!(Math.sign(speed1) == Math.sign(speed))) {
              speed = -(speed + speed1) / 2;
            } else {
              speed = -speed1;
            }
          }
          if (cars[myCar].HP > 0  && isHp && finished == 0) {
            cars[myCar].HP -= 10;
            barHP[myCar].style.width = cars[myCar].HP + "%";
            if (cars[myCar].HP == 0) {
              boomSound.play();
              getAchive(3);
              finished = 2;
              roundHTML.innerHTML = "EXPLODED";
              waiting.innerHTML = "waiting for the other players";
              mspeed = 0;

              Car.src = cars[myCar].Img.slice(0, -5) + "EXP.png";
              CarF.src = cars[myCar].Img.slice(0, -5) + "EXP.png";
              CarL.src = cars[myCar].Img.slice(0, -5) + "EXP.png";
              CarR.src = cars[myCar].Img.slice(0, -5) + "EXP.png";
            }
          }
          xspeed = Math.sin(angle) * speed;
          yspeed = Math.cos(angle) * speed;
        }
        cars[i].cflag = true;
      } else {
        cars[i].cflag = false;
      }
    }
  }

  canvasContext.rotate(drawAngle);
  canvasContext.translate(xspeed, yspeed);
  canvasContext.rotate(-drawAngle);

  y = window.getComputedStyle(move).top;
  x = window.getComputedStyle(move).left;
  y = y.slice(0, -2);
  x = x.slice(0, -2);
  y = Number(y);
  x = Number(x);

  if (CarPosY == "0") {
    move.style.top = String(-yspeed + y) + "px";
    move.style.left = String(-xspeed + x) + "px";

    xcanvas += xspeed;
    ycanvas += yspeed;
  } else {
    // move.style.top = String(y - yspeed + (Math.sin(Math.PI - drawAngle) * Math.sin(anglep - drawAngle) * carH - Math.sin(drawAngle - Math.PI/2) * (1 - Math.cos(anglep - drawAngle)) * carH)) + "px";
    // move.style.left = String(x - xspeed + (Math.cos(Math.PI - drawAngle) * Math.sin(anglep - drawAngle) * carH + Math.cos(drawAngle - Math.PI/2) * (1 - Math.cos(anglep - drawAngle)) * carH)) + "px";

    xcanvas -=
      -xspeed -
      (Math.cos(drawAngle) * Math.sin(anglep - drawAngle) * carH +
        Math.cos(Math.PI / 2 - drawAngle) *
          (1 - Math.cos(anglep - drawAngle)) *
          carH);
    ycanvas -=
      -yspeed -
      (-Math.sin(drawAngle) * Math.sin(anglep - drawAngle) * carH +
        Math.sin(Math.PI / 2 - drawAngle) *
          (1 - Math.cos(anglep - drawAngle)) *
          carH);

    move.style.top =
      String(
        -yspeed +
          y -
          (-Math.sin(drawAngle) * Math.sin(anglep - drawAngle) * carH +
            Math.sin(Math.PI / 2 - drawAngle) *
              (1 - Math.cos(anglep - drawAngle)) *
              carH)
      ) + "px";
    move.style.left =
      String(
        -xspeed +
          x -
          (Math.cos(drawAngle) * Math.sin(anglep - drawAngle) * carH +
            Math.cos(Math.PI / 2 - drawAngle) *
              (1 - Math.cos(anglep - drawAngle)) *
              carH)
      ) + "px";
  }

  x0 = ycanvas;
  x1 = ycanvas;
  y0 = xcanvas;
  y1 = xcanvas;

  //displayDots();
}

function initEventsListeners() {
  window.addEventListener("keydown", onCanvasKeyDown);
  window.addEventListener("keyup", onCanvasKeyUp);
  button.addEventListener("click", () => {
    window.location.href = "/menu";
  });
}

function drawCar(image, x, y) {
  if (CarPosY == -carH) {
    canvasContext.translate(0, -carH);
  }

  canvasContext.rotate(drawAngle);

  canvasContext.translate(-xcanvas, -ycanvas);

  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  // кажись здесь можно впихнуть отрисовку других машин
  for (let i = 0; i < amountOfPlayers; i++) {
    if (i != myCar) {
      canvasContext.translate(cars[i].X, cars[i].Y);
      canvasContext.rotate(-cars[i].Angle);
      canvasContext.drawImage(cars[i].Imag, x, 0, carW, carH);
      bar[i].style.top =
        Number(cars[i].Y) - 25 + 15 * Math.cos(Number(cars[i].Angle)) + "px";
      bar[i].style.left =
        Number(cars[i].X) - 25 + 15 * Math.sin(Number(cars[i].Angle)) + "px";
      barName[i].innerHTML = cars[i].Name;
      canvasContext.rotate(cars[i].Angle);
      canvasContext.translate(-cars[i].X, -cars[i].Y);
    }
  }
  // конец впихивания

  canvasContext.translate(xcanvas, ycanvas);

  canvasContext.rotate(-drawAngle);

  if (CarPosY == -carH) {
    canvasContext.translate(0, carH);
  }

  bar[myCar].style.top = ycanvas - 25 + 15 * Math.cos(angle) + "px";
  bar[myCar].style.left = xcanvas - 25 + 15 * Math.sin(angle) + "px";
  barName[myCar].innerHTML = cars[myCar].Name;

  canvasContext.drawImage(image, CarPosX, CarPosY, carW, carH);
}

function divme(a, b) {
  return (a - (a % b)) / b;
}

function reduceSpeed() {
  if (cars[0].cflag || cars[1].cflag || cars[2].cflag || cars[3].cflag) {
    return;
  }
  if (speed > 0) {
    if (speed - accel <= mspeed) {
      if (speed - resist > 0) {
        speed -= resist;
      } else {
        speed = 0;
      }
      xspeed = Math.sin(angle) * speed;
      yspeed = Math.cos(angle) * speed;
    } else {
      if (speed - ga > 0) {
        speed -= ga;
      } else {
        speed = 0;
      }
      xspeed = Math.sin(angle) * speed;
      yspeed = Math.cos(angle) * speed;
    }
  }
  if (speed < 0) {
    if (speed + accel >= -mspeed) {
      if (speed + resist < 0) {
        speed += resist;
      } else {
        speed = 0;
      }
      xspeed = Math.sin(angle) * speed;
      yspeed = Math.cos(angle) * speed;
    } else {
      if (speed + ga < 0) {
        speed += ga;
      } else {
        speed = 0;
      }
      xspeed = Math.sin(angle) * speed;
      yspeed = Math.cos(angle) * speed;
    }
  }
}

function updateReduce() {
  y = window.getComputedStyle(move).top;
  x = window.getComputedStyle(move).left;
  y = y.slice(0, -2);
  x = x.slice(0, -2);
  y = Number(y);
  x = Number(x);
  if (isLoaded) {
    curTile = Number(tiles[224 - (divme(x, 96) + divme(y, 96) * 15)]);
    //console.log(curTile);

    if (checkPointTiles.includes(curTile) && turnTiles[224 - (divme(x, 96) + divme(y, 96) * 15)] != curRound && finished == 0) {
      turnTiles[224 - (divme(x, 96) + divme(y, 96) * 15)] = curRound;
      checkCounter += 1;
      checkSound.play();
      checks.innerHTML = 'checks:' + checkCounter + '/' + maxCheck;
      checks.style.backgroundColor = "#ff0000";
      setTimeout(() => checks.style.backgroundColor = "#ffffff00", 100);
      // checks.classList.add("bigger");
      // checks.addEventListener("animationend", () => {
      //   checks.classList.remove("bigger");
      // });
      console.log(turnTiles[224 - (divme(x, 96) + divme(y, 96) * 15)]);
    }

    if (224 - (divme(x, 96) + divme(y, 96) * 15) == startingTile) {
      let flag = true;
      for (let i = 0; i < curRound; i++) {
        if (turnTiles.includes(i)) {
          flag = false;
        }
      }
      if (flag) {
        checkCounter = 0;
        checks.innerHTML = 'checks:' + checkCounter + '/' + maxCheck;
        checks.style.backgroundColor = "#ff0000";
        setTimeout(() => checks.style.backgroundColor = "#ffffff00", 100);
        // checks.classList.add("bigger");
        // checks.addEventListener("animationend", () => {
        //   checks.classList.remove("bigger");
        // });
        curRound += 1;
        if (curRound > maxRounds && sflag) {
          winSound.play();
          finished = 1;
          roundHTML.innerHTML = "FINISHED";
          checks.innerHTML = "";
          waiting.innerHTML = "waiting for the other players";
          mspeed = 0;
        } else {
          roundSound.play();
          roundHTML.innerHTML = 'round:' + curRound + "/" + maxRounds;
          roundHTML.style.backgroundColor = "#ff0000";
          setTimeout(() => roundHTML.style.backgroundColor = "#ffffff00", 100);
        }
      }
    }

    if (xcanvas < 192 || xcanvas > (1440-192) || ycanvas < 192 || ycanvas > (1440-192)) {
      wasd.space = 0;
    }

    if (grassArr.includes(curTile) && finished == 0) {
      //console.log('TRAVA')
      rspeed = mrspeed;
      mspeed = gs;
      accel = mspeed / 160;
      resist = accel / 4;
      bFlag = false;
    }
    if (roadArr.includes(curTile) && finished == 0) {
      //console.log('ASPHALT')
      rspeed = mrspeed;
      mspeed = mcarspeed;

      accel = mspeed / 160;
      resist = accel / 4;
      bFlag = false;
    }
    if (bRoadArr.includes(curTile) && finished == 0) {
      //console.log('ASPHALT')
      rspeed = mrspeed;
      mspeed = mcarspeed / 2;

      accel = mspeed / 160;
      resist = accel / 4;
      bFlag = false;
    }
    if (BGtransArr.includes(curTile) && finished == 0) {
      //console.log('ASPHALT')
      rspeed = mrspeed;
      mspeed = (mcarspeed / 3) * 2;

      accel = mspeed / 160;
      resist = accel / 4;
      bFlag = false;
    }
    if (borderArr.includes(curTile) && !bFlag) {
      //console.log('BORDER');
      angle += Math.PI;
      drawAngle += Math.PI;
      canvasContext.rotate(Math.PI);
      xspeed *= -1;
      yspeed *= -1;
      bFlag = true;
    }
  }
}

function diffDates(day_one, day_two) {
  return (day_one - day_two) / (60 * 60 * 24 * 1000);
}

function onCanvasKey() {
  if (
    wasd.w == 1 &&
    !cars[0].cflag &&
    !cars[1].cflag &&
    !cars[2].cflag &&
    !cars[3].cflag
  ) {
    if (speed < mspeed) {
      speed += accel;
      xspeed = Math.sin(angle) * speed;
      yspeed = Math.cos(angle) * speed;
    }
  }
  if (
    wasd.s == 1 &&
    !cars[0].cflag &&
    !cars[1].cflag &&
    !cars[2].cflag &&
    !cars[3].cflag
  ) {
    if (speed > -mspeed) {
      speed -= accel;
      xspeed = Math.sin(angle) * speed;
      yspeed = Math.cos(angle) * speed;
    }
  }
  if (
    wasd.d == 1 &&
    speed > 0 &&
    !cars[0].cflag &&
    !cars[1].cflag &&
    !cars[2].cflag &&
    !cars[3].cflag
  ) {
    if (speed >= pi1) {
      angle -= rspeed;
      drawAngle -= rspeed;
      canvasContext.rotate(rspeed);
      if (wasd.space == 1 && drawAngle > angle - Math.PI / 2) {
        drawAngle -= rspeed / 4;
        canvasContext.rotate(rspeed / 4);
      }
    } else {
      angle -= rspeed * Math.sin(speed / 2);
      drawAngle -= rspeed * Math.sin(speed / 2);
      canvasContext.rotate(rspeed * Math.sin(speed / 2));
    }
    if (speed > 0) {
      speed -= resist;
    }
    if (speed < 0) {
      speed += resist;
    }
    xspeed = Math.sin(angle) * speed;
    yspeed = Math.cos(angle) * speed;
  }
  if (
    wasd.a == 1 &&
    speed > 0 &&
    !cars[0].cflag &&
    !cars[1].cflag &&
    !cars[2].cflag &&
    !cars[3].cflag
  ) {
    if (speed >= pi1) {
      angle += rspeed;
      drawAngle += rspeed;
      canvasContext.rotate(-rspeed);
      if (wasd.space == 1 && drawAngle < angle + Math.PI / 2) {
        drawAngle += rspeed / 4;
        canvasContext.rotate(-rspeed / 4);
      }
    } else {
      angle += rspeed * Math.sin(speed / 2);
      drawAngle += rspeed * Math.sin(speed / 2);
      canvasContext.rotate(-rspeed * Math.sin(speed / 2));
    }
    if (speed > 0) {
      if (speed - resist > 0) {
        speed -= resist;
      } else {
        speed = 0;
      }
    }
    if (speed < 0) {
      if (speed + resist < 0) {
        speed += resist;
      } else {
        speed = 0;
      }
    }
    xspeed = Math.sin(angle) * speed;
    yspeed = Math.cos(angle) * speed;
  }
  if (
    wasd.d == 1 &&
    speed < 0 &&
    !cars[0].cflag &&
    !cars[1].cflag &&
    !cars[2].cflag &&
    !cars[3].cflag
  ) {
    if (speed <= -pi1) {
      angle += rspeed;
      drawAngle += rspeed;
      canvasContext.rotate(-rspeed);
    } else {
      angle += rspeed * Math.sin(-speed / 2);
      drawAngle += rspeed * Math.sin(-speed / 2);
      canvasContext.rotate(-rspeed * Math.sin(-speed / 2));
    }
    if (speed > 0) {
      if (speed - resist > 0) {
        speed -= resist;
      } else {
        speed = 0;
      }
    }
    if (
      speed < 0 &&
      !cars[0].cflag &&
      !cars[1].cflag &&
      !cars[2].cflag &&
      !cars[3].cflag
    ) {
      if (speed + resist < 0) {
        speed += resist;
      } else {
        speed = 0;
      }
    }
    xspeed = Math.sin(angle) * speed;
    yspeed = Math.cos(angle) * speed;
  }
  if (
    wasd.a == 1 &&
    speed < 0 &&
    !cars[0].cflag &&
    !cars[1].cflag &&
    !cars[2].cflag &&
    !cars[3].cflag
  ) {
    if (speed <= -pi1) {
      angle -= rspeed;
      drawAngle -= rspeed;
      canvasContext.rotate(rspeed);
    } else {
      angle -= rspeed * Math.sin(-speed / 2);
      drawAngle -= rspeed * Math.sin(-speed / 2);
      canvasContext.rotate(rspeed * Math.sin(-speed / 2));
    }
    if (speed > 0) {
      speed -= resist;
    }
    if (speed < 0) {
      speed += resist;
    }
    xspeed = Math.sin(angle) * speed;
    yspeed = Math.cos(angle) * speed;
  }
  if (wasd.space == 0 || Math.abs(speed) <= pi1) {
    if (drawAngle + rspeed < angle) {
      drawAngle += rspeed / 4;
      canvasContext.rotate(-rspeed / 4);
    } else {
      if (drawAngle + rspeed > angle) {
        drawAngle -= rspeed / 4;
        canvasContext.rotate(rspeed / 4);
      } else {
        // console.log(angle, drawAngle)
        // drawAngle = angle;
        // canvasContext.rotate(-(angle - drawAngle));
      }
    }
  }
  if (wasd.space == 1) {
    if (speed - breakes > 0 && speed > 0) {
      speed -= breakes;
    }
    if (speed + breakes < 0 && speed < 0) {
      speed += breakes;
    }
    if (
      (speed + breakes > 0 && speed < 0) ||
      (speed - breakes < 0 && speed > 0)
    ) {
      speed -= 0;
    }
  }
}

function onCanvasKeyUp(event) {
  Car = CarF;
  if (event.code === "KeyW") {
    wasd.w = 0;
    if (finished == 0 && wasd.r == 1) {
      audioGo.currentTime = 0;
      audioStart.currentTime = 0;
      audioStart.pause();
      audioGo.pause();
      if (Math.abs(speed) > 1) {
        audioStop.play();
      }
      audioStay.loop = true;
      audioStay.play();
    } else {
      audioGo.currentTime = 0;
      audioGo.pause();
    }
  }

  if (event.code === "KeyA") {
    wasd.a = 0;
    audioTires.currentTime = 0;
    audioTires.pause();
  }
  if (event.code === "KeyS") {
    wasd.s = 0;
    if (finished == 0 && wasd.r == 1) {
      audioGo.currentTime = 0;
      audioStart.currentTime = 0;
      audioStart.pause();
      audioGo.pause();
      if (Math.abs(speed) > 1) {
        audioStop.play();
      }
      audioStay.play();
    } else {
      audioGo.currentTime = 0;
      audioGo.pause();
    }
  }
  if (event.code === "KeyD") {
    wasd.d = 0;
    audioTires.currentTime = 0;
    audioTires.pause();
  }
  if (event.code === "Space") {
    wasd.space = 0;
  }
}

function audioFix() {
  if (wasd.w == 1 && Math.abs(speed) > 4 && finished == 0) {
    if (audioGo.currentTime >= audioGo.duration - 0.05) {
      audioStay.currentTime = 0;
      audioStay.pause();
      audioGo.currentTime = 0;
      audioGo.play();
    }
    requestAnimationFrame(audioFix);
  }
  if (wasd.w == 0 && wasd.s == 0 && wasd.r == 1) {
    if (audioStay.currentTime >= audioStay.duration - 0.05) {
      audioGo.currentTime = 0;
      audioGo.pause();
      audioStay.currentTime = 0;
      audioStay.play();
    }
    requestAnimationFrame(audioFix);
  }
  if (wasd.a == 1 && wasd.d == 1 && Math.abs(speed) > 4) {
    if (audioTires.currentTime >= audioTires.duration - 0.05) {
      audioTires.currentTime = 0;
      audioTires.play();
    }
    requestAnimationFrame(audioFix);
  } else {
    audioTires.currentTime = 0;
    audioTires.pause();
  }
  if (finished == 1) {
    audioGo.currentTime = 0;
    audioGo.pause();
  }
}
function onCanvasKeyDown(event) {
  let curTime = new Date();

  if (event.code === "KeyR") {
    if (wasd.r == 0) {
      wasd.r = 1;
      audioEngineOn.currentTime = 0;
      audioEngineOn.play();
      audioStay.loop = true;
      audioStay.play();
    } else {
      wasd.r = 0;
      wasd.w = 0;
      wasd.a = 0;
      wasd.s = 0;
      wasd.d = 0;
      wasd.space = 0;
      audioStart.pause();
      audioEngineOn.pause();
      audioGo.pause();
      audioStay.pause();
      audioStop.pause();
    }
  }
  dif1 = ((curTime - startTime) / 1000) % 60;

  //console.log(dif1);
  if (wasd.r == 1 && dif1 > 5 && ready != 0) {
    ready = 2;
    if (event.code === "KeyW") {
      wasd.w = 1;
      if (finished == 0) {
        audioStart.play();
        audioGo.loop = true;
        audioGo.play();
      } else {
        audioGo.currentTime = 0;
        audioGo.pause();
      }
    }

    if (event.code === "KeyS") {
      wasd.s = 1;
      if (finished == 0) {
        audioStart.play();
        audioGo.loop = true;
        audioGo.play();
      } else {
        audioGo.currentTime = 0;
        audioGo.pause();
      }
    }
  }
  if (event.code === "KeyA") {
    wasd.a = 1;
    Car = CarL;
    if (finished == 0 && Math.abs(speed) > 4 && !grassArr.includes(curTile)) {
      audioTires.loop = true;
      audioTires.play();
    } else {
      audioTires.currentTime = 0;
      audioTires.pause();
    }
  }
  if (event.code === "KeyD") {
    wasd.d = 1;
    Car = CarR;
    if (finished == 0 && Math.abs(speed) > 4 && !grassArr.includes(curTile)) {
      audioTires.loop = true;
      audioTires.play();
    } else {
      audioTires.currentTime = 0;
      audioTires.pause();
    }
  }
  if (event.code === "Space") {
    wasd.space = 1;
  }
}

function scrollToCenter() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const documentWidth = document.documentElement.scrollWidth;
  const documentHeight = document.documentElement.scrollHeight;

  const scrollHorizontalTo = Math.max(0, (documentWidth - windowWidth) / 2);
  const scrollVerticalTo = Math.max(0, (documentHeight - windowHeight) / 2);

  window.scrollTo({
    left: scrollHorizontalTo,
    top: scrollVerticalTo,
    behavior: "smooth",
  });
}

function displayDots() {
  y = window.getComputedStyle(move).top;
  x = window.getComputedStyle(move).left;
  y = y.slice(0, -2);
  x = x.slice(0, -2);
  y = Number(y);
  x = Number(x);

  carBorder = getBorders(x, y, angle + Math.PI, carH, carW);

  r1.style.top = String(carBorder.A[1]) + "px";
  r1.style.left = String(carBorder.A[0]) + "px";
  r2.style.top = String(carBorder.B[1]) + "px";
  r2.style.left = String(carBorder.B[0]) + "px";
  r3.style.top = String(carBorder.C[1]) + "px";
  r3.style.left = String(carBorder.C[0]) + "px";
  r4.style.top = String(carBorder.D[1]) + "px";
  r4.style.left = String(carBorder.D[0]) + "px";

  // // if (checkCrosses(carBorder, 434, 206)) {
  // //     console.log('touching');
  // }
}

function checkCrosses(border, x, y) {
  if (
    (border.AB.k * x + border.AB.b <= y &&
      border.BC.k * x + border.BC.b <= y &&
      border.CD.k * x + border.CD.b >= y &&
      border.DA.k * x + border.DA.b >= y) ||
    (border.AB.k * x + border.AB.b >= y &&
      border.BC.k * x + border.BC.b <= y &&
      border.CD.k * x + border.CD.b <= y &&
      border.DA.k * x + border.DA.b >= y) ||
    (border.AB.k * x + border.AB.b >= y &&
      border.BC.k * x + border.BC.b >= y &&
      border.CD.k * x + border.CD.b <= y &&
      border.DA.k * x + border.DA.b <= y) ||
    (border.AB.k * x + border.AB.b <= y &&
      border.BC.k * x + border.BC.b >= y &&
      border.CD.k * x + border.CD.b >= y &&
      border.DA.k * x + border.DA.b <= y)
  ) {
    return true;
  } else {
    return false;
  }
}

function getBorders(x, y, angle, height, width) {
  let O = [1440 - x, 1440 - y];
  let D = [
    O[0] + Math.cos(angle) * (width / 2),
    O[1] - Math.sin(angle) * (width / 2),
  ];
  let A = [
    O[0] - Math.cos(angle) * (width / 2),
    O[1] + Math.sin(angle) * (width / 2),
  ];
  let C = [D[0] - Math.sin(angle) * height, D[1] - Math.cos(angle) * height];
  let B = [A[0] - Math.sin(angle) * height, A[1] - Math.cos(angle) * height];
  //console.log(O, A, B, C, D);

  return {
    O: O,
    A: A,
    B: B,
    C: C,
    D: D,

    AB: {
      k: getK(A[0], B[0], A[1], B[1]),
      b: getB(B[0], B[1], getK(A[0], B[0], A[1], B[1])),
    },
    BC: {
      k: getK(B[0], C[0], B[1], C[1]),
      b: getB(C[0], C[1], getK(B[0], C[0], B[1], C[1])),
    },
    CD: {
      k: getK(C[0], D[0], C[1], D[1]),
      b: getB(D[0], D[1], getK(C[0], D[0], C[1], D[1])),
    },
    DA: {
      k: getK(D[0], A[0], D[1], A[1]),
      b: getB(A[0], A[1], getK(D[0], A[0], D[1], A[1])),
    },
  };
}

function getK(x1, x2, y1, y2) {
  return (y1 - y2) / (x1 - x2);
}

function getB(x2, y2, k) {
  return y2 - k * x2;
}

function getTiles() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/getKey");
  xhr.addEventListener("load", () => {
    console.log(xhr.responseText);
    info = JSON.parse(xhr.responseText);
    console.log(info);
    console.log(!info.hp);
    console.log(!info.collision);
    isHp = (!info.hp);
    isCollision = (!info.collision);
    console.log(isHp);
    console.log(isCollision);
    maxRounds = info.Rounds;
    myCar = info.InSessionId;

    let carss = info.Cars[myCar].split(" ");
    for (let i = 0; i < carss.length; i++) {
      if (carss[i].split("/")[6] == 1) {
        mcarspeed = carss[i].split("/")[1];
        mrspeed = carss[i].split("/")[4] * 0.006;
        accel = carss[i].split("/")[2] / 160;
        breakes = carss[i].split("/")[3] / 160;
      }
    }

    rspeed = mrspeed;
    console.log(mcarspeed, mrspeed);
    roundHTML.innerHTML = 'round:' + curRound + "/" + maxRounds;

    mapping = info.MapKey;
    console.log(mapping);
    tiles = mapping.split(" ");
    console.log(tiles);
    for (let i = 0; i < 225; i++) {
      if (checkPointTiles.includes(Number(tiles[i]))) {
        maxCheck += 1;
        checks.innerHTML = 'checks:' + checkCounter + '/' + maxCheck;
        turnTiles[i] = 0;
      }
    }
    console.log(turnTiles);
    amountOfPlayers = info.Cars.length;
    console.log(amountOfPlayers);
    isLoaded = true;
    findStartTile();
    startY = divme(startingTile, 15) * 96;
    startX = (startingTile % 15) * 96;
    for (let i = 0; i < amountOfPlayers; i++) {
      cars[i].Name = info.Nicknames[i];

      carss = info.Cars[i].split(" ");
      for (let g = 0; g < cars.length; g++) {
        if (carss[g].split("/")[6] == 1) {
          cars[i].Img = "/static/sprites/" + carss[g].split("/")[0] + ".png";
        }
      }

      console.log(cars[i].Img);
      cars[i].Imag = new Image();
      cars[i].Imag.src = cars[i].Img;
      cars[i].X = startX + 50;
      cars[i].Y = startY + 5 + carW / 2 + 23 * i;
      cars[i].Angle = Math.PI / 2;
      cars[i].Ready = 0;
      cars[i].Border = getBorders(
        startX + 50,
        startY + 5 + carW / 2 + 23 * i,
        Math.PI / 2,
        carH,
        carW
      );
    }
    console.log(cars);
    Car.src = cars[myCar].Img;
    CarF.src = cars[myCar].Img;
    CarL.src = cars[myCar].Img.slice(0, -4) + "L.png";
    CarR.src = cars[myCar].Img.slice(0, -4) + "R.png";
    console.log(startingTile);
    console.log(startX, startY);
    xcanvas = startX + 50;
    ycanvas = startY + 5 + carW / 2 + 23 * info.InSessionId;
    prepareCanvas();
    initEventsListeners();
    scrollToCenter();
    drawFrame();
  });
  xhr.send();
}

function prepareCanvas() {
  if (angle == Math.PI / 2 + 0.001) {
    if ((curCar = 1)) {
      canvasContext.translate(
        startX + 50,
        startY + 5 + carW / 2 + 23 * info.InSessionId
      );
      canvasContext.rotate(-angle);
      move.style.top =
        String(GAME.width - (startY + 5 + carW / 2 + 23 * info.InSessionId)) +
        "px";
      move.style.left = String(GAME.height - startX - 50) + "px";
    }
  }
}

function findStartTile() {
  for (let i = 0; i < 225; i++) {
    if (startArr.includes(tiles[i])) {
      startingTile = i;
      if (startStraightArr.includes(tiles[i])) {
        angle = Math.PI / 2 + 0.001;
        drawAngle = Math.PI / 2 + 0.001;
      }
    }
  }
}

let startTime = new Date();
console.log(startTime);

const achive = document.getElementById("achive");
const achiveImg = document.getElementById("achive__img");
const achiveTitle = document.getElementById("achive__title");
const achiveSubtitle = document.getElementById("achive__subtitle");
const achiveSteps = document.getElementById("achive__steps");
const audioAchive = new Audio();
audioAchive.src = "../static/sounds/achive.mp3";

function showAchive(imgSrc, title, subtitle, steps) {
  audioAchive.play();
  achiveImg.src = imgSrc;
  achiveTitle.innerHTML = title;
  achiveSubtitle.innerHTML = subtitle;
  achiveSteps.innerHTML = steps;
  achive.style.width = "13.5vw";
  achive.style.borderWidth = "4.5px";
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
  xhr.send(JSON.stringify(String(achivmentID)));
}

getTiles();

var socket = new WebSocket("wss:" + window.location.hostname + "/ws");

socket.onmessage = function (event) {
  var message = JSON.parse(event.data);
  let go = message.split(" ");
  //console.log(go);
  cars[go[5]].X = go[0];
  cars[go[5]].Y = go[1];
  cars[go[5]].Angle = go[2];
  cars[go[5]].Speed = go[3].split("/")[1];
  cars[go[5]].Ready = go[3].split("/")[0];
  if (ready == 0) {
    ready = 1;
    for (let i = 0; i < amountOfPlayers; i++) {
      if (cars[i].Ready == "0") {
        ready = 0;
      }
    }
    if (ready == 1) {
      startTime = new Date();
    }
  }
  cars[go[5]].Border = getBorders(go[0], go[1], go[2], carH, carW);
  if (go[5] != myCar) {
    cars[go[5]].HP = go[4];
    barHP[go[5]].style.width = go[4] + "%";
  }

  if (go.length == 7 && !table.is7) {
    table.is7 = true;
    if (go[6].split("/")[1] == "NF") {
      boomSound.play();
      notification.innerHTML = cars[go[6][0]].Name + " exploded";
      cars[go[6][0]].Imag.src = cars[go[5]].Imag.src.slice(0, -5) + "EXP.png";

    } else {
      table.first = go[6][0];
      notification.innerHTML = cars[go[6][0]].Name + " finished first";
      name1.innerHTML = cars[table.first].Name;
      time1.innerHTML = go[6].split("/")[1].slice(0, 7);
    }
  }
  if (go.length == 8 && !table.is8) {
    table.is8 = true;
    if (go[7].split("/")[1] == "NF") {
      boomSound.play();
      notification.innerHTML = cars[go[7][0]].Name + " exploded";
      cars[go[7][0]].Imag.src = cars[go[5]].Imag.src.slice(0, -5) + "EXP.png";

    } else {
      if (table.first == 4) {
        table.first = go[7][0];
        notification.innerHTML = cars[go[7][0]].Name + " finished first";
        name1.innerHTML = cars[table.first].Name;
        time1.innerHTML = go[7].split("/")[1].slice(0, 7);
      } else {
        table.second = go[7][0];
        notification.innerHTML = cars[table.second].Name + " finished second";
        name2.innerHTML = cars[table.second].Name;
        time2.innerHTML = go[7].split("/")[1].slice(0, 7);
      }
    }
  }
  if (go.length == 9 && !table.is9) {
    table.is9 = true;
    if (go[8].split("/")[1] == "NF") {
      boomSound.play();
      notification.innerHTML = cars[go[8][0]].Name + " exploded";
      cars[go[8][0]].Imag.src = cars[go[5]].Imag.src.slice(0, -5) + "EXP.png";
    } else {
      if (table.first == 4) {
        table.first = go[8][0];
        notification.innerHTML = cars[go[8][0]].Name + " finished first";
        name1.innerHTML = cars[table.first].Name;
        time1.innerHTML = go[8].split("/")[1].slice(0, 7);
      } else {
        if (table.second == 4) {
          table.second = go[8][0];
          notification.innerHTML = cars[go[8][0]].Name + " finished second";
          name2.innerHTML = cars[table.second].Name;
          time2.innerHTML = go[8].split("/")[1].slice(0, 7);
        } else {
          table.third = go[8][0];
          notification.innerHTML = cars[go[8][0]].Name + " finished third";
          name3.innerHTML = cars[table.third].Name;
          time3.innerHTML = go[8].split("/")[1].slice(0, 7);
        }
      }
    }
  }
  if (go.length == 10 && !table.is10) {
    table.is10 = true;
    if (go[9].split("/")[1] == "NF") {
      notification.innerHTML = cars[go[9][0]].Name + " exploded";
      boomSound.play();
      cars[go[9][0]].Imag.src = cars[go[5]].Imag.src.slice(0, -5) + "EXP.png";
    } else {
      if (table.first == 4) {
        table.first = go[9][0];
        notification.innerHTML = cars[go[9][0]].Name + " finished first";
        name1.innerHTML = cars[table.first].Name;
        time1.innerHTML = go[9].split("/")[1].slice(0, 7);
      } else {
        if (table.second == 4) {
          table.second = go[9][0];
          notification.innerHTML = cars[go[9][0]].Name + " finished second";
          name2.innerHTML = cars[table.second].Name;
          time2.innerHTML = go[9].split("/")[1].slice(0, 7);
        } else {
          if (table.third == 4) {
            table.third = go[9][0];
            notification.innerHTML = cars[go[9][0]].Name + " finished third";
            name3.innerHTML = cars[table.third].Name;
            time3.innerHTML = go[9].split("/")[1].slice(0, 7);
          } else {
            table.forth = go[9][0];
            notification.innerHTML = cars[go[9][0]].Name + " finished forth";
            name4.innerHTML = cars[table.forth].Name;
            time4.innerHTML = go[9].split("/")[1].slice(0, 7);
          }
        }
      }
    }
  }

  if (go.length - 6 == amountOfPlayers && !sended && isLoaded) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/getTable");
    xhr.addEventListener("load", () => {
      console.log(xhr.responseText);
      let infor = JSON.parse(xhr.responseText);
      money.innerHTML = " " + String(infor.response.Money);
      if (infor.response.Money == 60) {
        getAchive('2');
      }
      if (infor.response.Money == 15) {
        getAchive('6');
      }
      exp.innerHTML = " " + String(infor.response.Exp);
    });
    xhr.send(JSON.stringify(window.location.pathname.split("/")[2]));

    tabl.style.visibility = "visible";
    sended = true;
  }
};

socket.addEventListener("open", (event) => {
  sflag = true;
  var message =
    window.location.pathname.split("/")[2] +
    " race " +
    String(wasd.r) +
    "/" +
    String(speed) +
    " " +
    String(drawAngle) +
    " " +
    String(y0) +
    " " +
    String(x0) +
    " " +
    String(y1) +
    " " +
    String(x1) +
    " " +
    String(myCar) +
    " " +
    String(cars[myCar].HP) +
    " " +
    finished +
    " " +
    dif;
  socket.send(JSON.stringify(message));
});
