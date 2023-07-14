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

let GarageCars = [];
var Car = {
  scr: '',
  transmission: 1,
  engine: 1,
  breaks: 1,
  suspension: 1,
}
var GarageCarsCount = 0;
var carArrowCnt = 0;
Car.scr = document.getElementById("currentCar").src;
GarageCars[GarageCarsCount] = Car;

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
    //console.log(document.getElementById('JCar').src.substring(8, document.getElementById('JCar').src.length));
    GarageCarsCount += 1;
    carArrowCnt = GarageCarsCount;
    Car.scr = document.getElementById("currentCar").src;//.slice(8, 0);
    Car.transmission = 1;
    Car.engine = 1;
    Car.breaks = 1;
    Car.suspension = 1;
    GarageCars[GarageCarsCount] = Car;
    ShowPurchase();
  }
  if (this == ACarField){
    document.getElementById("currentCar").src = document.getElementById('ACar').src;
    GarageCarsCount += 1;
    carArrowCnt = GarageCarsCount;
    Car.transmission = 2;
    Car.engine = 2;
    Car.breaks = 2;
    Car.suspension = 2;
    Car.scr = document.getElementById("currentCar").src;
    GarageCars[GarageCarsCount] = Car;
    ShowPurchase();
  }
  if (this == UCarField){
    document.getElementById("currentCar").src = document.getElementById('UCar').src;
    GarageCarsCount += 1;
    carArrowCnt = GarageCarsCount;
    Car.transmission = 3;
    Car.engine = 3;
    Car.breaks = 3;
    Car.suspension = 3;
    Car.scr = document.getElementById("currentCar").src;
    GarageCars[GarageCarsCount] = Car;
    ShowPurchase();
  }
  if (this == BCarField){
    document.getElementById("currentCar").src = document.getElementById('BCar').src;
    GarageCarsCount += 1;
    carArrowCnt = GarageCarsCount;
    Car.transmission = 4;
    Car.engine = 4;
    Car.breaks = 4;
    Car.suspension = 4;
    Car.scr = document.getElementById("currentCar").src;
    GarageCars[GarageCarsCount] = Car;
    ShowPurchase();
  }


  if (this == GreyCarField){
    document.getElementById("currentCar").src = document.getElementById('greyCar').src;
    Car.scr = document.getElementById("currentCar").src;
    GarageCars[carArrowCnt] = Car;
  }
  if (this == GreenCarField){
    document.getElementById("currentCar").src = document.getElementById('greenCar').src;
    Car.scr = document.getElementById("currentCar").src;
    GarageCars[carArrowCnt] = Car;
  }
  if (this == RedCarField){
    document.getElementById("currentCar").src = document.getElementById('redCar').src;
    Car.scr = document.getElementById("currentCar").src;
    GarageCars[carArrowCnt] = Car;
  }
  if (this == YellowCarField){
    document.getElementById("currentCar").src = document.getElementById('yellowCar').src;
    Car.scr = document.getElementById("currentCar").src;
    GarageCars[carArrowCnt] = Car;
  }
  if (this == BlueCarField){
    document.getElementById("currentCar").src = document.getElementById('blueCar').src;
    Car.scr = document.getElementById("currentCar").src;
    GarageCars[carArrowCnt] = Car;
  }
}

function engineDec() {
  if (Car.engine > 1){
    document.getElementById("engineCnt").innerHTML = String(Car.engine - 1);
    document.querySelector(".FutureAccelerationGraph").style.width =  String(Car.engine - 1) + "vw";
    Car.engine -= 1;
    GarageCars[carArrowCnt] = Car;
  }
}

function engineInc() {
  if (Car.engine < 10){
    document.getElementById("engineCnt").innerHTML = String(Car.engine + 1);
    document.querySelector(".FutureAccelerationGraph").style.width =  String(Car.engine + 1) + "vw";
    Car.engine += 1;
    GarageCars[carArrowCnt] = Car;
  }
}

function transmissionDec() {
  if (Car.transmission > 1){
    document.getElementById("transmissionCnt").innerHTML = String(Car.transmission - 1);
    document.querySelector(".FutureMaxSpeedGraph").style.width =  String(Car.transmission - 1) + "vw";
    Car.transmission -= 1;
    GarageCars[carArrowCnt] = Car;
  }
}

function transmissionInc() {
  if (Car.transmission < 10){
    document.getElementById("transmissionCnt").innerHTML = String(Car.transmission + 1);
    document.querySelector(".FutureMaxSpeedGraph").style.width =  String(Car.transmission + 1) + "vw";
    Car.transmission += 1;
    GarageCars[carArrowCnt] = Car;
  }
}

function breaksDec() {
  if (Car.breaks > 1){
    document.getElementById("breaksCnt").innerHTML = String(Car.breaks - 1);
    document.querySelector(".FutureBrakingGraph").style.width =  String(Car.breaks - 1) + "vw";
    Car.breaks -= 1;
    GarageCars[carArrowCnt] = Car;
  }
}

function breaksInc() {
  if (Car.breaks < 10){
    document.getElementById("breaksCnt").innerHTML = String(Car.breaks + 1);
    document.querySelector(".FutureBrakingGraph").style.width =  String(Car.breaks + 1) + "vw";
    Car.breaks += 1;
    GarageCars[carArrowCnt] = Car;
  }
}

function suspensionDec() {
  if (Car.suspension > 1){
    document.getElementById("suspensionCnt").innerHTML = String(Car.suspension - 1);
    document.querySelector(".FutureManeuverabilityGraph").style.width =  String(Car.suspension - 1) + "vw";
    Car.suspension -= 1;
    GarageCars[carArrowCnt] = Car;
  }
}

function suspensionInc() {
  if (Car.suspension < 10){
    document.getElementById("suspensionCnt").innerHTML = String(Car.suspension + 1);
    document.querySelector(".FutureManeuverabilityGraph").style.width =  String(Car.suspension + 1) + "vw";
    Car.suspension += 1;
    GarageCars[carArrowCnt] = Car;
  }
}

function GarageCarDec() {
  if (carArrowCnt > 0) {
    carArrowCnt -= 1;
    console.log(carArrowCnt)
    console.log(GarageCars[carArrowCnt])
    Car = GarageCars[carArrowCnt] - 1;
    document.getElementById("currentCar").src = Car.scr;
    currentStyle();
  }
}

function GarageCarInc() {
  if (carArrowCnt < GarageCarsCount) {
    carArrowCnt += 1;
    console.log(carArrowCnt)
    console.log(GarageCars[carArrowCnt])
    Car = GarageCars[carArrowCnt];
    document.getElementById("currentCar").src = Car.scr;
    currentStyle();
  }
}
function ShowPurchase() {
  document.querySelector(".MaxSpeedGraph").style.width =  String(Car.transmission) + "vw";
  document.querySelector(".FutureMaxSpeedGraph").style.width =  String(Car.transmission) + "vw";
  document.querySelector(".AccelerationGraph").style.width =  String(Car.engine) + "vw";
  document.querySelector(".FutureAccelerationGraph").style.width =  String(Car.engine) + "vw";
  document.querySelector(".BrakingGraph").style.width =  String(Car.breaks) + "vw";
  document.querySelector(".FutureBrakingGraph").style.width =  String(Car.breaks) + "vw";
  document.querySelector(".ManeuverabilityGraph").style.width =  String(Car.suspension) + "vw";
  document.querySelector(".FutureManeuverabilityGraph").style.width =  String(Car.suspension) + "vw";
}