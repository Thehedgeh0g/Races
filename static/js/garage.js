const ShopField = document.getElementById("Shop");
const TuningField = document.getElementById("Tuning");
const StyleField = document.getElementById("Style");

const JCarField = document.getElementById("JCarField");
const ACarField = document.getElementById("ACarField");
const UCarField = document.getElementById("UCarField");
const BCarField = document.getElementById("BCarField");

const GreyCarField = document.getElementById("colorGreyCar");
const GreenCarField = document.getElementById("colorGreenCar");
const RedCarField = document.getElementById("colorRedCar");
const YellowCarField = document.getElementById("colorYellowCar");
const BlueCarField = document.getElementById("colorBlueCar");

const engineArrowLeft = document.getElementById("engineArrowLeft");
const engineArrowRight = document.getElementById("engineArrowRight");

const transmissionArrowLeft = document.getElementById("transmissionArrowLeft");
const transmissionArrowRight = document.getElementById("transmissionArrowRight"); 

const breaksArrowLeft = document.getElementById("breaksArrowLeft");
const breaksArrowRight = document.getElementById("breaksArrowRight");

const suspensionArrowLeft = document.getElementById("suspensionArrowLeft");
const suspensionArrowRight = document.getElementById("suspensionArrowRight");

const carArrowLeft = document.getElementById("carArrowLeft");
const carArrowRight = document.getElementById("carArrowRight");

let GarageCars = [
  {
    scr: '../static/sprites/JG.png',
    transmission: 1,
    engine: 1,
    breaks: 1,
    suspension: 1,
    stock: 1,
    isChosen: 1,
  },
  {
    scr: '../static/sprites/AG.png',
    transmission: 2,
    engine: 2,
    breaks: 2,
    suspension: 2,
    stock: 0,
    isChosen: 0,
  },
  {
    scr: '../static/sprites/UG.png',
    transmission: 3,
    engine: 3,
    breaks: 3,
    suspension: 3,
    stock: 0,
    isChosen: 0,
  },
  {
    scr: '../static/sprites/BG.png',
    transmission: 4,
    engine: 4,
    breaks: 4,
    suspension: 4,
    stock: 0,
    isChosen: 0,
  },
];

let xhrGarageCars = new XMLHttpRequest();
xhrGarageCars.open('GET', '/api/getGarageData');
xhrGarageCars.send();
xhrGarageCars.onload = function() {
  let GarageCars = xhrGarageCars.response;
  console.log(GarageCars);
};

var carArrowCnt = 0;
while(GarageCars[carArrowCnt].isChosen == 0){
  carArrowCnt += 1;
}

var GarageCarsCount = 0;
var Money = 0;
var PriceCarA = 0;
var PriceCarU = 0;
var PriceCarB = 0;
var PriceColor = 0;
var CostUpgrade = 0;

let xhr = new XMLHttpRequest();
xhr.open('GET', '');
xhr.send();
xhr.onload = function() {
  let stats = xhr.response;
  console.log(stats);
};


var TuningCar = {
  transmission: 1,
  engine: 1,
  breaks: 1,
  suspension: 1,
}

TuningCar.transmission = GarageCars[carArrowCnt].transmission;
TuningCar.engine = GarageCars[carArrowCnt].engine;
TuningCar.breaks = GarageCars[carArrowCnt].breaks;
TuningCar.suspension = GarageCars[carArrowCnt].suspension;

const tuningPurchase = document.getElementById("tuningPurchase");

var engineCnt = GarageCars[carArrowCnt].engine;
document.getElementById("engineCnt").innerHTML = engineCnt;
var transmissionCnt = GarageCars[carArrowCnt].transmission;
document.getElementById("transmissionCnt").innerHTML = transmissionCnt;
var breaksCnt = GarageCars[carArrowCnt].breaks;
document.getElementById("breaksCnt").innerHTML = breaksCnt;
var  suspensionCnt = GarageCars[carArrowCnt].suspension;
document.getElementById("suspensionCnt").innerHTML = suspensionCnt;

document.getElementById("currentCar").src = GarageCars[carArrowCnt].scr;

document.getElementById("PriceCarA").innerHTML = PriceCarA;
document.getElementById("PriceCarU").innerHTML = PriceCarU;
document.getElementById("PriceCarB").innerHTML = PriceCarB;

document.getElementById("PriceColor1").innerHTML = PriceColor;
document.getElementById("PriceColor2").innerHTML = PriceColor;
document.getElementById("PriceColor3").innerHTML = PriceColor;
document.getElementById("PriceColor4").innerHTML = PriceColor;
document.getElementById("PriceColor5").innerHTML = PriceColor;

document.getElementById("CostUpgrade").innerHTML = 'Upgrade cost: ' + String(CostUpgrade);

document.getElementById("Money").innerHTML = 'Money: ' + String(Money);

ShopField.addEventListener("click", showShop);
TuningField.addEventListener("click", showTuning);
StyleField.addEventListener("click", currentStyle); 
StyleField.addEventListener("click", showStyle);


JCarField.addEventListener("click", replaceCar);
ACarField.addEventListener("click", replaceCar);
UCarField.addEventListener("click", replaceCar);
BCarField.addEventListener("click", replaceCar);

GreyCarField.addEventListener("click", replaceCar);
GreenCarField.addEventListener("click", replaceCar);
RedCarField.addEventListener("click", replaceCar);
YellowCarField.addEventListener("click", replaceCar);
BlueCarField.addEventListener("click", replaceCar);

engineArrowLeft.addEventListener("click", engineDec);
engineArrowRight.addEventListener("click", engineInc);

transmissionArrowLeft.addEventListener("click", transmissionDec);
transmissionArrowRight.addEventListener("click", transmissionInc);

breaksArrowLeft.addEventListener("click", breaksDec);
breaksArrowRight.addEventListener("click", breaksInc);

suspensionArrowLeft.addEventListener("click", suspensionDec);
suspensionArrowRight.addEventListener("click", suspensionInc);

tuningPurchase.addEventListener("click", AcceptPurchase);

carArrowLeft.addEventListener("click", GarageCarDec);
carArrowRight.addEventListener("click", GarageCarInc);


function showShop() {
  document.querySelector(".style-field").style.visibility = "hidden";
  document.querySelector(".tuning-field").style.visibility = "hidden";
  document.querySelector(".shop-field").style.visibility = "visible";
  ShowPurchase();
  showOwned();
}

function showTuning() {
  document.querySelector(".shop-field").style.visibility = "hidden";
  document.querySelector(".style-field").style.visibility = "hidden";
  document.querySelector(".tuning-field").style.visibility = "visible";
  ShowPurchase();
}

function showStyle() {
  document.querySelector(".shop-field").style.visibility = "hidden";
  document.querySelector(".tuning-field").style.visibility = "hidden";
  document.querySelector(".style-field").style.visibility = "visible";
  ShowPurchase();
}

function showOwned() {
  if (GarageCars[1].stock == 1){
    ACarField.textContent = 'Owned';
  }
  if (GarageCars[2].stock == 1){
    UCarField.textContent = 'Owned';
  }
  if (GarageCars[3].stock == 1){
    BCarField.textContent = 'Owned';
  }
}
function currentStyle() {
  var str = document.getElementById("currentCar").src;
  if (str[str.length-6] == 'J'){
    document.getElementById('greyCar').src = '../static/sprites/JG.png';
    document.getElementById('greenCar').src = '../static/sprites/JZ.png';
    document.getElementById('redCar').src = '../static/sprites/JR.png';
    document.getElementById('yellowCar').src = '../static/sprites/JY.png';
    document.getElementById('blueCar').src = '../static/sprites/JB.png';
  }
  if (str[str.length-6] == 'A'){
    document.getElementById('greyCar').src = '../static/sprites/AG.png';
    document.getElementById('greenCar').src = '../static/sprites/AZ.png';
    document.getElementById('redCar').src = '../static/sprites/AR.png';
    document.getElementById('yellowCar').src = '../static/sprites/AY.png';
    document.getElementById('blueCar').src = '../static/sprites/AB.png';
  }
  if (str[str.length-6] == 'U'){
    document.getElementById('greyCar').src = '../static/sprites/UG.png';
    document.getElementById('greenCar').src = '../static/sprites/UZ.png';
    document.getElementById('redCar').src = '../static/sprites/UR.png';
    document.getElementById('yellowCar').src = '../static/sprites/UY.png';
    document.getElementById('blueCar').src = '../static/sprites/UB.png';
  }
  if (str[str.length-6] == 'B'){
    document.getElementById('greyCar').src = '../static/sprites/BG.png';
    document.getElementById('greenCar').src = '../static/sprites/BZ.png';
    document.getElementById('redCar').src = '../static/sprites/BR.png';
    document.getElementById('yellowCar').src = '../static/sprites/BY.png';
    document.getElementById('blueCar').src = '../static/sprites/BB.png';
  }
}
function replaceCar() {
  if (GarageCarsCount < 3){
    if ((this == ACarField) && (GarageCars[1].stock != 1)){
      let car = 'ACar';
      let xhrACar = new XMLHttpRequest();
      xhrACar.open("POST", "");
      xhrACar.send(car);
      xhrACar.onload = () => {
        if (xhrACar.response) {
          carArrowCnt = 1;
          document.getElementById("currentCar").src = GarageCars[carArrowCnt].scr;
          GarageCarsCount += 1;
          ACarField.textContent = 'Owned';
          GarageCars[carArrowCnt].stock = 1;
          TuningCar.transmission = GarageCars[carArrowCnt].transmission;
          TuningCar.engine = GarageCars[carArrowCnt].engine;
          TuningCar.breaks = GarageCars[carArrowCnt].breaks;
          TuningCar.suspension = GarageCars[carArrowCnt].suspension;
          ShowPurchase();
        }
      }
    }

    if ((this == UCarField) && (GarageCars[2].stock != 1)){
      let car = 'UCar';
      let xhrUCar = new XMLHttpRequest();
      xhrUCar.open("POST", "");
      xhrUCar.send(car);
      xhrUCar.onload = () => {
        if (xhrUCar.response) {
          carArrowCnt = 2;
          document.getElementById("currentCar").src = GarageCars[carArrowCnt].scr;
          GarageCarsCount += 1;
          UCarField.textContent = 'Owned';
          GarageCars[carArrowCnt].stock = 1;
          TuningCar.transmission = GarageCars[carArrowCnt].transmission;
          TuningCar.engine = GarageCars[carArrowCnt].engine;
          TuningCar.breaks = GarageCars[carArrowCnt].breaks;
          TuningCar.suspension = GarageCars[carArrowCnt].suspension;
          ShowPurchase();
        }
      }
    }
    if ((this == BCarField) && (GarageCars[3].stock != 1)){
      let car = 'BCar';
      let xhrBCar = new XMLHttpRequest();
      xhrBCar.open("POST", "");
      xhrBCar.send(car);
      xhrBCar.onload = () => {
        if (xhrBCar.response) {
          carArrowCnt = 3;
          document.getElementById("currentCar").src = GarageCars[carArrowCnt].scr;
          GarageCarsCount += 1;
          BCarField.textContent = 'Owned';
          GarageCars[carArrowCnt].stock = 1;
          TuningCar.transmission = GarageCars[carArrowCnt].transmission;
          TuningCar.engine = GarageCars[carArrowCnt].engine;
          TuningCar.breaks = GarageCars[carArrowCnt].breaks;
          TuningCar.suspension = GarageCars[carArrowCnt].suspension;
          ShowPurchase();
        }
      }
    }

  }
  if (this == GreyCarField){
    var src = document.getElementById('greyCar').src;
    let xhrGreyColor = new XMLHttpRequest();
    xhrGreyColor.open("POST", "");
    xhrGreyColor.send(src);
    xhrGreyColor.onload = () => {
      if (xhrGreyColor.response) {
        document.getElementById("currentCar").src = document.getElementById('greyCar').src;
        GarageCars[carArrowCnt].scr = document.getElementById("currentCar").src;
      }
    }
  }
  if (this == GreenCarField){
    var src = document.getElementById('greenCar').src;
    let xhrGreenColor = new XMLHttpRequest();
    xhrGreenColor.open("POST", "");
    xhrGreenColor.send(src);
    xhrGreenColor.onload = () => {
      if (xhrGreenColor.response) {
        document.getElementById("currentCar").src = document.getElementById('greenCar').src;
        GarageCars[carArrowCnt].scr = document.getElementById("currentCar").src;
      }
    }
  }
  if (this == RedCarField){
    var src = document.getElementById('redCar').src;
    let xhrRedColor = new XMLHttpRequest();
    xhrRedColor.open("POST", "");
    xhrRedColor.send(src);
    xhrRedColor.onload = () => {
      if (xhrRedColor.response) {
        document.getElementById("currentCar").src = document.getElementById('redCar').src;
        GarageCars[carArrowCnt].scr = document.getElementById("currentCar").src;
      }
    }
  }
  if (this == YellowCarField){
    var src = document.getElementById('yellowCar').src;
    let xhrYellowColor = new XMLHttpRequest();
    xhrYellowColor.open("POST", "");
    xhrYellowColor.send(src);
    xhrYellowColor.onload = () => {
      if (xhrYellowColor.response) {
        document.getElementById("currentCar").src = document.getElementById('yellowCar').src;
        GarageCars[carArrowCnt].scr = document.getElementById("currentCar").src;
      }
    }
  }
  if (this == BlueCarField){
    var src = document.getElementById('blueCar').src;
    let xhrBlueColor = new XMLHttpRequest();
    xhrBlueColor.open("POST", "");
    xhrBlueColor.send(src);
    xhrBlueColor.onload = () => {
      if (xhrBlueColor.response) {
        document.getElementById("currentCar").src = document.getElementById('blueCar').src;
        GarageCars[carArrowCnt].scr = document.getElementById("currentCar").src;
      }
    }
  }
}

function engineDec() {
  if (TuningCar.engine > 1){
    document.getElementById("engineCnt").innerHTML = String(TuningCar.engine - 1);
    document.querySelector(".FutureAccelerationGraph").style.width =  String(TuningCar.engine - 1) + "vw";
    TuningCar.engine -= 1;
    ShowPurchaseFututre();
  }
}

function engineInc() {
  if (TuningCar.engine < 10){
    document.getElementById("engineCnt").innerHTML = String(TuningCar.engine + 1);
    document.querySelector(".FutureAccelerationGraph").style.width =  String(TuningCar.engine + 1) + "vw";
    TuningCar.engine += 1;
    ShowPurchaseFututre();
  }
}

function transmissionDec() {
  if (TuningCar.transmission > 1){
    document.getElementById("transmissionCnt").innerHTML = String(TuningCar.transmission - 1);
    document.querySelector(".FutureMaxSpeedGraph").style.width =  String(TuningCar.transmission - 1) + "vw";
    TuningCar.transmission -= 1;
    ShowPurchaseFututre();
  }
}

function transmissionInc() {
  if (TuningCar.transmission < 10){
    document.getElementById("transmissionCnt").innerHTML = String(TuningCar.transmission + 1);
    document.querySelector(".FutureMaxSpeedGraph").style.width =  String(TuningCar.transmission + 1) + "vw";
    TuningCar.transmission += 1;
    ShowPurchaseFututre();
  }
}

function breaksDec() {
  if (TuningCar.breaks > 1){
    document.getElementById("breaksCnt").innerHTML = String(TuningCar.breaks - 1);
    document.querySelector(".FutureBrakingGraph").style.width =  String(TuningCar.breaks - 1) + "vw";
    TuningCar.breaks -= 1;
    ShowPurchaseFututre();
  }
}

function breaksInc() {
  if (TuningCar.breaks < 10){
    document.getElementById("breaksCnt").innerHTML = String(TuningCar.breaks + 1);
    document.querySelector(".FutureBrakingGraph").style.width =  String(TuningCar.breaks + 1) + "vw";
    TuningCar.breaks += 1;
    ShowPurchaseFututre();
  }
}

function suspensionDec() {
  if (TuningCar.suspension > 1){
    document.getElementById("suspensionCnt").innerHTML = String(TuningCar.suspension - 1);
    document.querySelector(".FutureManeuverabilityGraph").style.width =  String(TuningCar.suspension - 1) + "vw";
    TuningCar.suspension -= 1;
    ShowPurchaseFututre();
  }
}

function suspensionInc() {
  if (TuningCar.suspension < 10){
    document.getElementById("suspensionCnt").innerHTML = String(TuningCar.suspension + 1);
    document.querySelector(".FutureManeuverabilityGraph").style.width =  String(TuningCar.suspension + 1) + "vw";
    TuningCar.suspension += 1;
    ShowPurchaseFututre();
  }
}

function GarageCarDec() {
  if (carArrowCnt > 0) {
    carArrowCnt -= 1;
    while (GarageCars[carArrowCnt].stock == 0){
      carArrowCnt -= 1;
    }
    document.getElementById("currentCar").src = GarageCars[carArrowCnt].scr;
    currentStyle();
    ShowPurchase();
  }
}

function GarageCarInc() {
  if (carArrowCnt < GarageCarsCount) {
    carArrowCnt += 1;
    while (GarageCars[carArrowCnt].stock == 0){
      carArrowCnt += 1;
    }
    document.getElementById("currentCar").src = GarageCars[carArrowCnt].scr;
    currentStyle();
    ShowPurchase();
  }
}
function ShowPurchaseFututre() {
  
  document.getElementById("engineCnt").innerHTML = String(TuningCar.engine);
  document.getElementById("transmissionCnt").innerHTML = String(TuningCar.transmission);
  document.getElementById("breaksCnt").innerHTML = String(TuningCar.breaks);
  document.getElementById("suspensionCnt").innerHTML = String(TuningCar.suspension);
  
  document.querySelector(".FutureMaxSpeedGraph").style.width =  String(TuningCar.transmission) + "vw";
  document.querySelector(".FutureAccelerationGraph").style.width =  String(TuningCar.engine) + "vw";
  document.querySelector(".FutureBrakingGraph").style.width =  String(TuningCar.breaks) + "vw";
  document.querySelector(".FutureManeuverabilityGraph").style.width =  String(TuningCar.suspension) + "vw";
}
function ShowPurchase() {
  document.getElementById("engineCnt").innerHTML = String(GarageCars[carArrowCnt].engine);
  document.getElementById("transmissionCnt").innerHTML = String(GarageCars[carArrowCnt].transmission);
  document.getElementById("breaksCnt").innerHTML = String(GarageCars[carArrowCnt].breaks);
  document.getElementById("suspensionCnt").innerHTML = String(GarageCars[carArrowCnt].suspension);

  document.querySelector(".MaxSpeedGraph").style.width =  String(GarageCars[carArrowCnt].transmission) + "vw";
  document.querySelector(".FutureMaxSpeedGraph").style.width =  String(GarageCars[carArrowCnt].transmission) + "vw";
  document.querySelector(".AccelerationGraph").style.width =  String(GarageCars[carArrowCnt].engine) + "vw";
  document.querySelector(".FutureAccelerationGraph").style.width =  String(GarageCars[carArrowCnt].engine) + "vw";
  document.querySelector(".BrakingGraph").style.width =  String(GarageCars[carArrowCnt].breaks) + "vw";
  document.querySelector(".FutureBrakingGraph").style.width =  String(GarageCars[carArrowCnt].breaks) + "vw";
  document.querySelector(".ManeuverabilityGraph").style.width =  String(GarageCars[carArrowCnt].suspension) + "vw";
  document.querySelector(".FutureManeuverabilityGraph").style.width =  String(GarageCars[carArrowCnt].suspension) + "vw";

  TuningCar.transmission = GarageCars[carArrowCnt].transmission;
  TuningCar.engine = GarageCars[carArrowCnt].engine;
  TuningCar.breaks = GarageCars[carArrowCnt].breaks;
  TuningCar.suspension = GarageCars[carArrowCnt].suspension;
}

function AcceptPurchase() {
  var str = '/' + String(TuningCar.transmission) + '/' + String(TuningCar.engine) + '/' + String(TuningCar.suspension) + '/' + String(TuningCar.breaks) + '/';
  let xhrTuning = new XMLHttpRequest();
  xhrTuning.open("POST", "");
  xhrTuning.send(src);
  xhrTuning.onload = () => {
    if (xhrTuning.response) {
      GarageCars[carArrowCnt].transmission = TuningCar.transmission;
      GarageCars[carArrowCnt].engine = TuningCar.engine;
      GarageCars[carArrowCnt].breaks = TuningCar.breaks;
      GarageCars[carArrowCnt].suspension = TuningCar.suspension;
    }
  }
  ShowPurchase();
}