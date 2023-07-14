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

tuningPurchase.addEventListener("click", ShowPurchase);


// var xhr = new XMLHttpRequest();
// xhr.open("GET", "");
// xhr.send();
// xhr.addEventListener("load", () =>{  })

function showShop() {
  document.querySelector(".style-field").style.visibility = "hidden";
  document.querySelector(".tuning-field").style.visibility = "hidden";
  document.querySelector(".shop-field").style.visibility = "visible";
}

function showTuning() {
  document.querySelector(".shop-field").style.visibility = "hidden";
  document.querySelector(".style-field").style.visibility = "hidden";
  document.querySelector(".tuning-field").style.visibility = "visible";
}

function showStyle() {
  document.querySelector(".shop-field").style.visibility = "hidden";
  document.querySelector(".tuning-field").style.visibility = "hidden";
  document.querySelector(".style-field").style.visibility = "visible";
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
  if (this == JCarField){
    document.getElementById("currentCar").src = document.getElementById('JCar').src;
  }
  if (this == ACarField){
    document.getElementById("currentCar").src = document.getElementById('ACar').src;
  }
  if (this == UCarField){
    document.getElementById("currentCar").src = document.getElementById('UCar').src;
  }
  if (this == BCarField){
    document.getElementById("currentCar").src = document.getElementById('BCar').src;
  }


  if (this == GreyCarField){
    document.getElementById("currentCar").src = document.getElementById('greyCar').src;
  }
  if (this == GreenCarField){
    document.getElementById("currentCar").src = document.getElementById('greenCar').src;
  }
  if (this == RedCarField){
    document.getElementById("currentCar").src = document.getElementById('redCar').src;
  }
  if (this == YellowCarField){
    document.getElementById("currentCar").src = document.getElementById('yellowCar').src;
  }
  if (this == BlueCarField){
    document.getElementById("currentCar").src = document.getElementById('blueCar').src;
  }
}

function engineDec() {
  if (engineCnt > 1){
    document.getElementById("engineCnt").innerHTML = String(engineCnt - 1);
    document.querySelector(".FutureAccelerationGraph").style.width =  String(engineCnt - 1) + "vw";
    engineCnt -= 1;
  }
}

function engineInc() {
  if (engineCnt < 10){
    document.getElementById("engineCnt").innerHTML = String(engineCnt + 1);
    document.querySelector(".FutureAccelerationGraph").style.width =  String(engineCnt + 1) + "vw";
    engineCnt += 1;
  }
}

function transmissionDec() {
  if (transmissionCnt > 1){
    document.getElementById("transmissionCnt").innerHTML = String(transmissionCnt - 1);
    document.querySelector(".FutureMaxSpeedGraph").style.width =  String(transmissionCnt - 1) + "vw";
    transmissionCnt -= 1;
  }
}

function transmissionInc() {
  if (transmissionCnt < 10){
    document.getElementById("transmissionCnt").innerHTML = String(transmissionCnt + 1);
    document.querySelector(".FutureMaxSpeedGraph").style.width =  String(transmissionCnt + 1) + "vw";
    transmissionCnt += 1;
  }
}

function breaksDec() {
  if (breaksCnt > 1){
    document.getElementById("breaksCnt").innerHTML = String(breaksCnt - 1);
    document.querySelector(".FutureBrakingGraph").style.width =  String(breaksCnt - 1) + "vw";
    breaksCnt -= 1;
  }
}

function breaksInc() {
  if (breaksCnt < 10){
    document.getElementById("breaksCnt").innerHTML = String(breaksCnt + 1);
    document.querySelector(".FutureBrakingGraph").style.width =  String(breaksCnt + 1) + "vw";
    breaksCnt += 1;
  }
}

function suspensionDec() {
  if (suspensionCnt > 1){
    document.getElementById("suspensionCnt").innerHTML = String(suspensionCnt - 1);
    document.querySelector(".FutureManeuverabilityGraph").style.width =  String(suspensionCnt - 1) + "vw";
    suspensionCnt -= 1;
  }
}

function suspensionInc() {
  if (suspensionCnt < 10){
    document.getElementById("suspensionCnt").innerHTML = String(suspensionCnt + 1);
    document.querySelector(".FutureManeuverabilityGraph").style.width =  String(suspensionCnt + 1) + "vw";
    suspensionCnt += 1;
  }
}

function ShowPurchase() {
  document.querySelector(".MaxSpeedGraph").style.width =  String(transmissionCnt) + "vw";
  document.querySelector(".AccelerationGraph").style.width =  String(engineCnt) + "vw";
  document.querySelector(".BrakingGraph").style.width =  String(breaksCnt) + "vw";
  document.querySelector(".ManeuverabilityGraph").style.width =  String(suspensionCnt) + "vw";
}