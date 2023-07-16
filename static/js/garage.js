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
    scr: '',
    transmission: 1,
    engine: 1,
    breaks: 1,
    suspension: 1,
    stock: 1,
  },
  {
    scr: '',
    transmission: 1,
    engine: 1,
    breaks: 1,
    suspension: 1,
    stock: 0,
  },
  {
    scr: '',
    transmission: 1,
    engine: 1,
    breaks: 1,
    suspension: 1,
    stock: 0,
  },
  {
    scr: '',
    transmission: 1,
    engine: 1,
    breaks: 1,
    suspension: 1,
    stock: 0,
  },
];

var GarageCarsCount = 0;
var carArrowCnt = 0;
GarageCars[carArrowCnt].scr = document.getElementById("currentCar").src;
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

var engineCnt = 1;
document.getElementById("engineCnt").innerHTML = engineCnt;
var transmissionCnt = 1;
document.getElementById("transmissionCnt").innerHTML = transmissionCnt;
var breaksCnt = 1;
document.getElementById("breaksCnt").innerHTML = breaksCnt;
var  suspensionCnt = 1;
document.getElementById("suspensionCnt").innerHTML = suspensionCnt;

var futureEngineCnt = 1;


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


// var xhr = new XMLHttpRequest();
// xhr.open("GET", "");
// xhr.send();
// xhr.addEventListener("load", () =>{  })

function showShop() {
  document.querySelector(".style-field").style.visibility = "hidden";
  document.querySelector(".tuning-field").style.visibility = "hidden";
  document.querySelector(".shop-field").style.visibility = "visible";
  ShowPurchase();
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
    if ((this == ACarField) && (GarageCars[1].stock != 1) && (GarageCars[2].stock != 1) && (GarageCars[3].stock != 1)){
      document.getElementById("currentCar").src = document.getElementById('ACar').src;
      GarageCarsCount += 1;
      carArrowCnt = GarageCarsCount;
      GarageCars[GarageCarsCount].scr = document.getElementById("currentCar").src;
      GarageCars[GarageCarsCount].transmission = 2;
      GarageCars[GarageCarsCount].engine = 2;
      GarageCars[GarageCarsCount].breaks = 2;
      GarageCars[GarageCarsCount].suspension = 2;
      ACarField.textContent = 'in garage';
      GarageCars[GarageCarsCount].stock = 1;
      TuningCar.transmission = GarageCars[carArrowCnt].transmission;
      TuningCar.engine = GarageCars[carArrowCnt].engine;
      TuningCar.breaks = GarageCars[carArrowCnt].breaks;
      TuningCar.suspension = GarageCars[carArrowCnt].suspension;
      ShowPurchase();
    }
    if ((this == UCarField) && (GarageCars[1].stock != 2) && (GarageCars[2].stock != 2) && (GarageCars[3].stock != 2)){
      document.getElementById("currentCar").src = document.getElementById('UCar').src;
      GarageCarsCount += 1;
      carArrowCnt = GarageCarsCount;
      GarageCars[GarageCarsCount].scr = document.getElementById("currentCar").src;
      GarageCars[GarageCarsCount].transmission = 3;
      GarageCars[GarageCarsCount].engine = 3;
      GarageCars[GarageCarsCount].breaks = 3;
      GarageCars[GarageCarsCount].suspension = 3;
      UCarField.textContent = 'in garage';
      GarageCars[GarageCarsCount].stock = 2;
      TuningCar.transmission = GarageCars[carArrowCnt].transmission;
      TuningCar.engine = GarageCars[carArrowCnt].engine;
      TuningCar.breaks = GarageCars[carArrowCnt].breaks;
      TuningCar.suspension = GarageCars[carArrowCnt].suspension;
      ShowPurchase();
    }
    if ((this == BCarField) && (GarageCars[1].stock != 3) && (GarageCars[2].stock != 3) && (GarageCars[3].stock != 3)){
      document.getElementById("currentCar").src = document.getElementById('BCar').src;
      GarageCarsCount += 1;
      carArrowCnt = GarageCarsCount;
      GarageCars[GarageCarsCount].scr = document.getElementById("currentCar").src;
      GarageCars[GarageCarsCount].transmission = 4;
      GarageCars[GarageCarsCount].engine = 4;
      GarageCars[GarageCarsCount].breaks = 4;
      GarageCars[GarageCarsCount].suspension = 4;
      BCarField.textContent = 'in garage';
      GarageCars[GarageCarsCount].stock = 3;
      TuningCar.transmission = GarageCars[carArrowCnt].transmission;
      TuningCar.engine = GarageCars[carArrowCnt].engine;
      TuningCar.breaks = GarageCars[carArrowCnt].breaks;
      TuningCar.suspension = GarageCars[carArrowCnt].suspension;
      ShowPurchase();
    }

  }
  if (this == GreyCarField){
    document.getElementById("currentCar").src = document.getElementById('greyCar').src;
    GarageCars[carArrowCnt].scr = document.getElementById("currentCar").src;
  }
  if (this == GreenCarField){
    document.getElementById("currentCar").src = document.getElementById('greenCar').src;
    GarageCars[carArrowCnt].scr = document.getElementById("currentCar").src;
  }
  if (this == RedCarField){
    document.getElementById("currentCar").src = document.getElementById('redCar').src;
    GarageCars[carArrowCnt].scr = document.getElementById("currentCar").src;
  }
  if (this == YellowCarField){
    document.getElementById("currentCar").src = document.getElementById('yellowCar').src;
    GarageCars[carArrowCnt].scr = document.getElementById("currentCar").src;
  }
  if (this == BlueCarField){
    document.getElementById("currentCar").src = document.getElementById('blueCar').src;
    GarageCars[carArrowCnt].scr = document.getElementById("currentCar").src;
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
    document.getElementById("currentCar").src = GarageCars[carArrowCnt].scr;
    currentStyle();
    ShowPurchase();
  }
}

function GarageCarInc() {
  if (carArrowCnt < GarageCarsCount) {
    carArrowCnt += 1;
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
  GarageCars[carArrowCnt].transmission = TuningCar.transmission;
  GarageCars[carArrowCnt].engine = TuningCar.engine;
  GarageCars[carArrowCnt].breaks = TuningCar.breaks;
  GarageCars[carArrowCnt].suspension = TuningCar.suspension;
  ShowPurchase();
}