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

let xcanvas = 0;
let ycanvas = 0;

let wasd = {
  w: 0,
  a: 0,
  s: 0,
  d: 0,
};

const dial = document.getElementById("dial");

const r1 = document.getElementById("r1");
const r2 = document.getElementById("r2");
const r3 = document.getElementById("r3");
const r4 = document.getElementById("r4");

const grassArr = [1, 2, 3, 4];
const roadArr = [11, 10, 9, 8, 7, 6, 31];
const BGtransArr = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const bRoadArr = [13, 14, 15, 16, 17, 18];
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
    Speed: null,
    Border: null,
    cflag: false,
  },
  {
    Name: null,
    Img: null,
    Imag: null,
    X: null,
    Y: null,
    Angle: null,
    Speed: null,
    Border: null,
    cflag: false,
  },
  {
    Name: null,
    Img: null,
    Imag: null,
    X: null,
    Y: null,
    Angle: null,
    Speed: null,
    Border: null,
    cflag: false,
  },
  {
    Name: null,
    Img: null,
    Imag: null,
    X: null,
    Y: null,
    Angle: null,
    Speed: null,
    Border: null,
    cflag: false,
  },
];

let y0 = 0;
let x0 = 0;
let y1 = 0;
let x1 = 0;

const mapdot = [];

mapdot[0] = document.getElementById("mapdot0");
mapdot[1] = document.getElementById("mapdot1");
mapdot[2] = document.getElementById("mapdot2");
mapdot[3] = document.getElementById("mapdot3");

console.log(mapdot);

let sflag = false;

const checkPointTiles = [31, 32, 33, 34, 35, 36];

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

let vzhoom = new Audio();

function drawFrame() {
  setTimeout(() => {
    onCanvasKey();
    UpdatePosition();
    drawCar(Car, CarPosX, CarPosY);
    drawMapDots();
    dial.style.transform = "rotate(" + Math.abs(speed * 18) + "deg)";
    if (sflag == true) {
      var message =
        window.location.pathname.split("/")[2] +
        " race " +
        String(speed) +
        " " +
        String(angle) +
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
        finished +
        "/" +
        dif;
      socket.send(JSON.stringify(message));
      //console.log(message);
    }

    endTime = new Date();
    dif = endTime - startTime;
    dif =
      String(divme((endTime - startTime) / 1000, 60)) +
      ":" +
      String(((endTime - startTime) / 1000) % 60);
    //console.log(dif);

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
      mapdot[i].style.top = cars[i].Y / 19.2 + "px";
      mapdot[i].style.left = cars[i].X / 19.2 + "px";
    }
  }
}

function UpdatePosition() {
  bFlag = false;
  updateReduce();
  reduceSpeed();

  canvasContext.rotate(angle);
  canvasContext.translate(xspeed, yspeed);
  canvasContext.rotate(-angle);

  y = window.getComputedStyle(move).top;
  x = window.getComputedStyle(move).left;
  y = y.slice(0, -2);
  x = x.slice(0, -2);
  y = Number(y);
  x = Number(x);

  for (let i = 0; i < amountOfPlayers; i++) {
    if (i != myCar) {
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
          //angle = Number(cars[i].Angle);
          speed = Number(cars[i].Speed);

          console.log(angle);
          console.log(speed);
          xspeed = Math.sin(angle) * speed;
          yspeed = Math.cos(angle) * speed;
        }
        cars[i].cflag = true;
      } else {
        cars[i].cflag = false;
      }
    }
  }

  move.style.top = String(-yspeed + y) + "px";
  move.style.left = String(-xspeed + x) + "px";

  displayDots();

  y0 = xcanvas;
  x0 = ycanvas;

  xcanvas += xspeed;
  ycanvas += yspeed;

  y1 = xcanvas;
  x1 = ycanvas;
}

function initEventsListeners() {
  window.addEventListener("keydown", onCanvasKeyDown);
  window.addEventListener("keyup", onCanvasKeyUp);
  button.addEventListener("click", () => {
    window.location.href = "/menu";
  });
}

function drawCar(image, x, y) {
  canvasContext.rotate(angle);
  canvasContext.translate(-xcanvas, -ycanvas);
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  // кажись сдесь можно впихнуть отрисовку других машин
  for (let i = 0; i < amountOfPlayers; i++) {
    if (i != myCar) {
      canvasContext.translate(cars[i].X, cars[i].Y);
      canvasContext.rotate(-cars[i].Angle);
      canvasContext.drawImage(cars[i].Imag, x, y, carW, carH);
      canvasContext.rotate(cars[i].Angle);
      canvasContext.translate(-cars[i].X, -cars[i].Y);
    }
  }
  // конец впихивания
  canvasContext.translate(xcanvas, ycanvas);
  canvasContext.rotate(-angle);
  canvasContext.drawImage(image, x, y, carW, carH);
}

function divme(a, b) {
  return (a - (a % b)) / b;
}

function reduceSpeed() {
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

    if (
      checkPointTiles.includes(
        Number(tiles[224 - (divme(x, 96) + divme(y, 96) * 15)])
      )
    ) {
      turnTiles[224 - (divme(x, 96) + divme(y, 96) * 15)] = curRound;
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
        curRound += 1;
        if (curRound > maxRounds && sflag) {
          finished = 1;
          roundHTML.innerHTML = "FINISHED";
          waiting.innerHTML = "waiting for the other players";
          mspeed = 0;
        } else {
          roundHTML.innerHTML = curRound + "/" + maxRounds;
        }
      }
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
  if (wasd.w == 1) {
    if (speed < mspeed) {
      speed += accel;
      xspeed = Math.sin(angle) * speed;
      yspeed = Math.cos(angle) * speed;
    }
  }
  if (wasd.s == 1) {
    if (speed > -mspeed) {
      speed -= accel;
      xspeed = Math.sin(angle) * speed;
      yspeed = Math.cos(angle) * speed;
    }
  }
  if (wasd.d == 1 && speed > 0) {
    if (speed >= pi1) {
      angle -= rspeed;
      canvasContext.rotate(rspeed);
    } else {
      angle -= rspeed * Math.sin(speed / 2);
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
  if (wasd.a == 1 && speed > 0) {
    if (speed >= pi1) {
      angle += rspeed;
      canvasContext.rotate(-rspeed);
    } else {
      angle += rspeed * Math.sin(speed / 2);
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
  if (wasd.d == 1 && speed < 0) {
    if (speed <= -pi1) {
      angle += rspeed;
      canvasContext.rotate(-rspeed);
    } else {
      angle += rspeed * Math.sin(-speed / 2);
      canvasContext.rotate(-rspeed * Math.sin(-speed / 2));
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
  if (wasd.a == 1 && speed < 0) {
    if (speed <= -pi1) {
      angle -= rspeed;
      canvasContext.rotate(rspeed);
    } else {
      angle -= rspeed * Math.sin(-speed / 2);
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
}

function onCanvasKeyUp(event) {
  Car.src = cars[myCar].Img;
  if (event.code === "KeyW") {
    wasd.w = 0;
    // vzhoom.src = '';
    // vzhoom.stop();
  }
  if (event.code === "KeyA") {
    wasd.a = 0;
  }
  if (event.code === "KeyS") {
    wasd.s = 0;
  }
  if (event.code === "KeyD") {
    wasd.d = 0;
  }
}

function onCanvasKeyDown(event) {
  if (event.code === "KeyW") {
    wasd.w = 1;
    
    // vzhoom.src = '/static/sounds/jiga2k.mp3';
    // vzhoom.play();
  }
  if (event.code === "KeyA") {
    wasd.a = 1;
    Car.src = cars[myCar].Img.slice(0, -4) + 'L.png';
  }
  if (event.code === "KeyS") {
    wasd.s = 1;
  }
  if (event.code === "KeyD") {
    wasd.d = 1;
    Car.src = cars[myCar].Img.slice(0, -4) + 'R.png';
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

  // carBorder = getBorders(x, y, angle, carH, carW);

  // // //r1.style.top = String(A[1]) + 'px';
  // // //r1.style.left = String(A[0]) + 'px';

  // // r1.style.top = String(206) + 'px';
  // // r1.style.left = String(434) + 'px';
  // // r2.style.top = String(carBorder.B[1]) + 'px';
  // // r2.style.left = String(carBorder.B[0]) + 'px';
  // // r3.style.top = String(carBorder.C[1]) + 'px';
  // // r3.style.left = String(carBorder.C[0]) + 'px';
  // // r4.style.top = String(carBorder.D[1]) + 'px';
  // // r4.style.left = String(carBorder.D[0]) + 'px';

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
  let C = [D[0] + Math.sin(angle) * height, D[1] + Math.cos(angle) * height];
  let B = [A[0] + Math.sin(angle) * height, A[1] + Math.cos(angle) * height];
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
    maxRounds = info.Rounds;
    myCar = info.InSessionId;

    let carss = info.Cars[myCar].split(" ")
    for(let i = 0; i < carss.length; i++) {
        if (carss[i].split("/")[6] == 1) {
            mcarspeed = carss[i].split("/")[1];
            mrspeed = carss[i].split("/")[3] * 0.006;
        }
    }

    rspeed = mrspeed;
    console.log(mcarspeed, mrspeed);
    roundHTML.innerHTML = curRound + "/" + maxRounds;

    mapping = info.MapKey;
    console.log(mapping);
    tiles = mapping.split(" ");
    console.log(tiles);
    for (let i = 0; i < 225; i++) {
      if (checkPointTiles.includes(Number(tiles[i]))) {
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

      carss = info.Cars[i].split(" ")
      for(let g = 0; g < cars.length; g++) {
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
      cars[i].Speed = 0;
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
  if ((angle = Math.PI / 2)) {
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
        angle = Math.PI / 2;
      }
    }
  }
}

let startTime = new Date();
console.log(startTime);
getTiles();

var socket = new WebSocket("wss:" + window.location.hostname + "/ws");

socket.onmessage = function (event) {
  var message = JSON.parse(event.data);
  let go = message.split(" ");
  //console.log(go);
  cars[go[4]].X = go[0];
  cars[go[4]].Y = go[1];
  cars[go[4]].Angle = go[2];
  cars[go[4]].Speed = go[3];
  cars[go[4]].Border = getBorders(go[0], go[1], go[2], carH, carW);
  if (go.length == 6) {
    table.first = go[5][0];
    notification.innerHTML = cars[table.first].Name + " finished first";
  }
  if (go.length == 7) {
    table.first = go[5][0];
    table.second = go[6][0];
    notification.innerHTML = cars[table.second].Name + " finished second";
  }
  if (go.length == 8) {
    table.first = go[5][0];
    table.second = go[6][0];
    table.third = go[7][0];
    notification.innerHTML = cars[table.third].Name + " finished third";
  }
  if (go.length == 9) {
    table.first = go[5][0];
    table.second = go[6][0];
    table.third = go[7][0];
    table.forth = go[8][0];
    notification.innerHTML = cars[table.forth].Name + "finished forth";
  }

  if (go.length - 5 == amountOfPlayers && !sended && isLoaded) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/getTable");
    xhr.addEventListener("load", () => {
      console.log(xhr.responseText);
      let infor = JSON.parse(xhr.responseText);
      money.innerHTML = " " + String(infor.response.Money);
      exp.innerHTML = " " + String(infor.response.Exp);
    });
    xhr.send(JSON.stringify(window.location.pathname.split("/")[2]));
    if (go.length >= 6) {
      name1.innerHTML = cars[table.first].Name;
      time1.innerHTML = go[5].split("/")[1].slice(0, 7);
    }
    if (go.length >= 7) {
      name2.innerHTML = cars[table.second].Name;
      time2.innerHTML = go[6].split("/")[1].slice(0, 7);
    }
    if (go.length >= 8) {
      name3.innerHTML = cars[table.third].Name;
      time3.innerHTML = go[7].split("/")[1].slice(0, 7);
    }
    if (go.length >= 9) {
      name4.innerHTML = cars[table.forth].Name;
      time4.innerHTML = go[8].split("/")[1].slice(0, 7);
    }

    tabl.style.visibility = "visible";
    sended = true;
  }
};

socket.addEventListener("open", (event) => {
  sflag = true;
  var message =
    window.location.pathname.split("/")[2] +
    " race " +
    String(speed) +
    " " +
    String(angle) +
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
    finished +
    " " +
    dif;
  socket.send(JSON.stringify(message));
});
