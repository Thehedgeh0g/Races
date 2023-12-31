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

const NotMoney = document.getElementById("NotMoney");

const achive = document.getElementById("achive");
const achiveImg = document.getElementById("achive__img");
const achiveTitle = document.getElementById("achive__title");
const achiveSubtitle = document.getElementById("achive__subtitle");
const achiveSteps = document.getElementById("achive__steps");
const audioAchive = new Audio();
audioAchive.src = "../static/sounds/achive.mp3";

const audioBuy = new Audio();
audioBuy.src = "../static/sounds/buy.mp3";

let Data = '';
let GarageCars = [
  {},
  {},
  {},
  {},
];
var carArrowCnt = 0;
let xhr = new XMLHttpRequest();
var GarageCarsCount = 0;
var Money = '';
var PriceCarA = 0;
var PriceCarU = 0;
var PriceCarB = 0;
var PriceColor = 0;
var CostUpgrade = 0;
var CostPurchase = 0;

var TuningCar = {
  transmission: 1,
  engine: 1,
  breaks: 1,
  suspension: 1,
}

var engineCnt = 0;
var transmissionCnt = 0;
var breaksCnt = 0;
var suspensionCnt = 0;

xhr.open('GET', '/api/getGarageData');
xhr.send();
xhr.onload = function() {
  Data = JSON.parse(xhr.response);
  GarageCars = Data.Garage.Cars;
  while(GarageCars[carArrowCnt].IsChoosen == '0'){
    carArrowCnt += 1;
  }

  for (let i = 0; i < 4; i++){
    if (GarageCars[i].Stock == '1'){
      GarageCarsCount += 1;
    }
  }
  PriceCarA = Data.Garage.Prices.ACarPrice;
  PriceCarU = Data.Garage.Prices.UCarPrice;
  PriceCarB = Data.Garage.Prices.BCarPrice;
  PriceColor = Data.Garage.Prices.ColorPrice;
  CostUpgrade = Data.Garage.Prices.ModPrice;
  Money = Data.Garage.Money;

  TuningCar.transmission =  Number(GarageCars[carArrowCnt].Transmission);
  TuningCar.engine = Number(GarageCars[carArrowCnt].Engine);
  TuningCar.breaks = Number(GarageCars[carArrowCnt].Breaks);
  TuningCar.suspension = Number(GarageCars[carArrowCnt].Suspension);
  

  engineCnt = TuningCar.transmission;
  transmissionCnt = TuningCar.engine;
  breaksCnt = TuningCar.breaks;
  suspensionCnt = TuningCar.suspension; 

  document.getElementById("currentCar").src = '/static/sprites/' + String(GarageCars[carArrowCnt].Scr) + '.png';
  document.getElementById("CostUpgrade").innerHTML = 'Upgrade cost: ' + CostPurchase; 
  document.getElementById("Money").innerHTML = 'Money: ' + Money;

  document.getElementById("engineCnt").innerHTML = engineCnt;
  document.getElementById("transmissionCnt").innerHTML = transmissionCnt;
  document.getElementById("breaksCnt").innerHTML = breaksCnt;
  document.getElementById("suspensionCnt").innerHTML = suspensionCnt;

  document.getElementById("PriceCarA").innerHTML = PriceCarA;
  document.getElementById("PriceCarU").innerHTML = PriceCarU;
  document.getElementById("PriceCarB").innerHTML = PriceCarB;

  document.getElementById("PriceColor1").innerHTML = PriceColor;
  document.getElementById("PriceColor2").innerHTML = PriceColor;
  document.getElementById("PriceColor3").innerHTML = PriceColor;
  document.getElementById("PriceColor4").innerHTML = PriceColor;
  document.getElementById("PriceColor5").innerHTML = PriceColor;

  ShowPurchase();
  showShop();

};

const tuningPurchase = document.getElementById("tuningPurchase");

const BackToMenu = document.getElementById("BackToMenu");

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

let musicOff = true;
document.body.addEventListener("mousemove", playMusic);
document.body.addEventListener("canplaythrough", playMusic);

function playMusic(){
  if (musicOff){
    musicOff = false;
    let audio = new Audio();
    audio.volume = 0.3;
    var musicFolder = '../static/music/garage/';
    var music = new Array('need_for_speed_carbon_06.Gary Numan & Tubeway Army - Are Friends Electric.mp3','need_for_speed_most_wanted_03 - Rock - I Am Rock.mp3', 'need_for_speed_most_wanted_04 - Suni Clay - In A Hood Near You.mp3', 'need_for_speed_most_wanted_07 - Hush-Fired up.mp3', 'need_for_speed_underground_2_1. Snoop Dogg ft The Doors - Riders on the Storm(fredwreck remix).mp3');
    var rand_file_index = Math.round(Math.random()*(music.length-1));
    var rand_file_name = music[rand_file_index];
    console.log(rand_file_name);
    audio.src = musicFolder + rand_file_name;
    audio.play();
  }
}


tuningPurchase.addEventListener("mousedown", ()=> { 
  tuningPurchase.classList.add("pressed"); 
});
tuningPurchase.addEventListener("mouseup", ()=> { 
  tuningPurchase.classList.remove("pressed"); 
});
tuningPurchase.addEventListener("mouseleave", ()=> { 
  tuningPurchase.classList.remove("pressed"); 
});

JCarField.addEventListener("mousedown", ()=> { 
  JCarField.classList.add("pressed"); 
});
JCarField.addEventListener("mouseup", ()=> { 
  JCarField.classList.remove("pressed"); 
});
JCarField.addEventListener("mouseleave", ()=> { 
  JCarField.classList.remove("pressed"); 
});

ACarField.addEventListener("mousedown", ()=> { 
  ACarField.classList.add("pressed"); 
});
ACarField.addEventListener("mouseup", ()=> { 
  ACarField.classList.remove("pressed"); 
});
ACarField.addEventListener("mouseleave", ()=> { 
  ACarField.classList.remove("pressed"); 
});

UCarField.addEventListener("mousedown", ()=> { 
  UCarField.classList.add("pressed"); 
});
UCarField.addEventListener("mouseup", ()=> { 
  UCarField.classList.remove("pressed"); 
});
UCarField.addEventListener("mouseleave", ()=> { 
  UCarField.classList.remove("pressed"); 
});

BCarField.addEventListener("mousedown", ()=> { 
  BCarField.classList.add("pressed"); 
});
BCarField.addEventListener("mouseup", ()=> { 
  BCarField.classList.remove("pressed"); 
});
BCarField.addEventListener("mouseleave", ()=> { 
  BCarField.classList.remove("pressed"); 
});

GreyCarField.addEventListener("mousedown", ()=> { 
  GreyCarField.classList.add("pressed"); 
});
GreyCarField.addEventListener("mouseup", ()=> { 
  GreyCarField.classList.remove("pressed"); 
});
GreyCarField.addEventListener("mouseleave", ()=> { 
  GreyCarField.classList.remove("pressed"); 
});

GreenCarField.addEventListener("mousedown", ()=> { 
  GreenCarField.classList.add("pressed"); 
});
GreenCarField.addEventListener("mouseup", ()=> { 
  GreenCarField.classList.remove("pressed"); 
});
GreenCarField.addEventListener("mouseleave", ()=> { 
  GreenCarField.classList.remove("pressed"); 
});

RedCarField.addEventListener("mousedown", ()=> { 
  RedCarField.classList.add("pressed"); 
});
RedCarField.addEventListener("mouseup", ()=> { 
  RedCarField.classList.remove("pressed"); 
});
RedCarField.addEventListener("mouseleave", ()=> { 
  RedCarField.classList.remove("pressed"); 
});

YellowCarField.addEventListener("mousedown", ()=> { 
  YellowCarField.classList.add("pressed"); 
});
YellowCarField.addEventListener("mouseup", ()=> { 
  YellowCarField.classList.remove("pressed"); 
});
YellowCarField.addEventListener("mouseleave", ()=> { 
  YellowCarField.classList.remove("pressed"); 
});

BlueCarField.addEventListener("mousedown", ()=> { 
  BlueCarField.classList.add("pressed"); 
});
BlueCarField.addEventListener("mouseup", ()=> { 
  BlueCarField.classList.remove("pressed"); 
});
BlueCarField.addEventListener("mouseleave", ()=> { 
  BlueCarField.classList.remove("pressed"); 
});

ShopField.addEventListener("mousedown", ()=> { 
  ShopField.classList.add("pressed"); 
});
ShopField.addEventListener("mouseup", ()=> { 
  ShopField.classList.remove("pressed"); 
});
ShopField.addEventListener("mouseleave", ()=> { 
  ShopField.classList.remove("pressed"); 
});

TuningField.addEventListener("mousedown", ()=> { 
  TuningField.classList.add("pressed"); 
});
TuningField.addEventListener("mouseup", ()=> { 
  TuningField.classList.remove("pressed"); 
});
TuningField.addEventListener("mouseleave", ()=> { 
  TuningField.classList.remove("pressed"); 
});

StyleField.addEventListener("mousedown", ()=> { 
  StyleField.classList.add("pressed"); 
});
StyleField.addEventListener("mouseup", ()=> { 
  StyleField.classList.remove("pressed"); 
});
StyleField.addEventListener("mouseleave", ()=> { 
  StyleField.classList.remove("pressed"); 
});

BackToMenu.addEventListener('click', ()=> {
  window.location.href = "/menu"
});

function showAchive(imgSrc, title, subtitle, steps) {
  audioAchive.play();
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
      if(resp.achivment.AchivmentPath != "") {
          showAchive(resp.achivment.AchivmentPath, resp.achivment.Achivment, resp.achivment.AchivmentCom, resp.achivment.AchivmentDesc);
      }
    }); 
}


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
  if (GarageCars[1].Stock == '1'){
    ACarField.textContent = 'Owned';
  }
  if (GarageCars[2].Stock == '1'){
    UCarField.textContent = 'Owned';
  }
  if (GarageCars[3].Stock == '1'){
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
  if (GarageCarsCount < 4){
    if ((this == ACarField) && (GarageCars[1].Stock != '1')){
      let car = 'ACar'; 
      let xhrACar = new XMLHttpRequest();
      xhrACar.open("POST", "/api/buyCar");
      xhrACar.send(JSON.stringify(car));
      xhrACar.onload = () => {
        let answer = JSON.parse(xhrACar.response);
        if (answer.response) {

          carArrowCnt = 1;
          document.getElementById("currentCar").src = '/static/sprites/' + String(GarageCars[carArrowCnt].Scr) + '.png';
          GarageCarsCount += 1;
          ACarField.textContent = 'Owned';
          GarageCars[carArrowCnt].Stock = '1';
          Money -= PriceCarA;
          document.getElementById("Money").innerHTML = 'Money: ' + Money;
          ShowPurchase();
          if (GarageCarsCount == 4) {
            getAchive('11');
          }
        }
        else {
          NotMoney.style.display = "block";
          getAchive('13');
        }
      }
    }

    if ((this == UCarField) && (GarageCars[2].Stock != '1')){
      let car = 'UCar';
      let xhrUCar = new XMLHttpRequest();
      xhrUCar.open("POST", "/api/buyCar");
      xhrUCar.send(JSON.stringify(car));
      xhrUCar.onload = () => {
        let answer = JSON.parse(xhrUCar.response);
        if (answer.response) {

          carArrowCnt = 2;
          document.getElementById("currentCar").src = '/static/sprites/' + String(GarageCars[carArrowCnt].Scr) + '.png';
          GarageCarsCount += 1;
          UCarField.textContent = 'Owned';
          GarageCars[carArrowCnt].Stock = '1';
          Money -= PriceCarU;
          document.getElementById("Money").innerHTML = 'Money: ' + Money;
          ShowPurchase();
          if (GarageCarsCount == 4) {
            getAchive('11');
          }
        }
        else {
          NotMoney.style.display = "block";
          getAchive('13');
        }
      }
    }
    if ((this == BCarField) && (GarageCars[3].Stock != '1')){
      let car = 'BCar';
      let xhrBCar = new XMLHttpRequest();
      xhrBCar.open("POST", "/api/buyCar");
      xhrBCar.send(JSON.stringify(car));
      xhrBCar.onload = () => {
        let answer = JSON.parse(xhrBCar.response);
        if (answer.response) {

          carArrowCnt = 3;
          document.getElementById("currentCar").src = '/static/sprites/' + String(GarageCars[carArrowCnt].Scr) + '.png';
          GarageCarsCount += 1;
          BCarField.textContent = 'Owned';
          GarageCars[carArrowCnt].Stock = '1';
          Money -= PriceCarB;
          document.getElementById("Money").innerHTML = 'Money: ' + Money;
          ShowPurchase();
          if (GarageCarsCount == 4) {
            getAchive('11');
          }
        }
        else {
          NotMoney.style.display = "block";
          getAchive('13');
        }
      }
    }

  }

  if (this == GreyCarField){
    var src = document.getElementById('greyCar').src; 
    src = src.slice(src.length-6  , src.length-4); 
    let xhrGreyColor = new XMLHttpRequest();
    xhrGreyColor.open("POST", "/api/buyColor");
    xhrGreyColor.send(JSON.stringify(src));
    xhrGreyColor.onload = () => {
      let answer = JSON.parse(xhrGreyColor.response);
      if (answer.response) {
        if (document.getElementById("currentCar").src == document.getElementById('greyCar').src) {
          getAchive('12');
        }
        document.getElementById("currentCar").src = document.getElementById('greyCar').src;
        GarageCars[carArrowCnt].Scr = src; 
        Money -= PriceColor;
        document.getElementById("Money").innerHTML = 'Money: ' + Money;
      }
      else {
        NotMoney.style.display = "block";
        getAchive('13');
      }
    }
  }
  if (this == GreenCarField){
    var src = document.getElementById('greenCar').src;
    src = src.slice(src.length-6  , src.length-4); 
    let xhrGreenColor = new XMLHttpRequest();
    xhrGreenColor.open("POST", "/api/buyColor");
    xhrGreenColor.send(JSON.stringify(src));
    xhrGreenColor.onload = () => {
      let answer = JSON.parse(xhrGreenColor.response);
      if (answer.response) {
        if (document.getElementById("currentCar").src == document.getElementById('greenCar').src) {
          getAchive('12');
        }
        document.getElementById("currentCar").src = document.getElementById('greenCar').src;
        GarageCars[carArrowCnt].Scr = src;
        Money -= PriceColor;
        document.getElementById("Money").innerHTML = 'Money: ' + Money;
        if (GarageCars[carArrowCnt].Scr == 'JZ') {
          getAchive('7');
        }
      }
      else {
        NotMoney.style.display = "block";
        getAchive('13');
      }
    }
  }
  if (this == RedCarField){
    var src = document.getElementById('redCar').src;
    src = src.slice(src.length-6  , src.length-4); 
    let xhrRedColor = new XMLHttpRequest();
    xhrRedColor.open("POST", "/api/buyColor");
    xhrRedColor.send(JSON.stringify(src));
    xhrRedColor.onload = () => {
      let answer = JSON.parse(xhrRedColor.response);
      if (answer.response) {
        if (document.getElementById("currentCar").src == document.getElementById('redCar').src) {
          getAchive('12');
        }
        document.getElementById("currentCar").src = document.getElementById('redCar').src;
        GarageCars[carArrowCnt].Scr = src;
        Money -= PriceColor;
        document.getElementById("Money").innerHTML = 'Money: ' + Money;
        if (GarageCars[carArrowCnt].Scr == 'AR') {
          getAchive('8');
        }
      }
      else {
        NotMoney.style.display = "block";
        getAchive('13');
      }
    }
  }
  if (this == YellowCarField){
    var src = document.getElementById('yellowCar').src;
    src = src.slice(src.length-6  , src.length-4); 
    let xhrYellowColor = new XMLHttpRequest();
    xhrYellowColor.open("POST", "/api/buyColor");
    xhrYellowColor.send(JSON.stringify(src));
    xhrYellowColor.onload = () => {
      let answer = JSON.parse(xhrYellowColor.response);
      if (answer.response) {
        if (document.getElementById("currentCar").src == document.getElementById('yellowCar').src) {
          getAchive('12');
        }
        document.getElementById("currentCar").src = document.getElementById('yellowCar').src;
        GarageCars[carArrowCnt].Scr = src;
        Money -= PriceColor;
        document.getElementById("Money").innerHTML = 'Money: ' + Money;
      }
      else {
        NotMoney.style.display = "block";
        getAchive('13');
      }
    }
  }
  if (this == BlueCarField){
    var src = document.getElementById('blueCar').src;
    src = src.slice(src.length-6  , src.length-4); 
    let xhrBlueColor = new XMLHttpRequest();
    xhrBlueColor.open("POST", "/api/buyColor");
    xhrBlueColor.send(JSON.stringify(src));
    xhrBlueColor.onload = () => {
      let answer = JSON.parse(xhrBlueColor.response);
      if (answer.response) {
        if (document.getElementById("currentCar").src == document.getElementById('blueCar').src) {
          getAchive('12');
        }
        document.getElementById("currentCar").src = document.getElementById('blueCar').src;
        GarageCars[carArrowCnt].Scr = src;
        Money -= PriceColor;
        document.getElementById("Money").innerHTML = 'Money: ' + Money;
      }
      else {
        NotMoney.style.display = "block";
        getAchive('13');
      }
    }
  }
}

function engineDec() {
  if (TuningCar.engine > 1){
    document.getElementById("engineCnt").innerHTML = String(TuningCar.engine - 1);
    document.querySelector(".FutureAccelerationGraph").style.width =  String(TuningCar.engine - 1) + "vw";
    TuningCar.engine -= 1;
    CostPurchase -= CostUpgrade;
    ShowPurchaseFututre();
  }
}

function engineInc() {
  if (TuningCar.engine < 10){
    document.getElementById("engineCnt").innerHTML = String(TuningCar.engine + 1);
    document.querySelector(".FutureAccelerationGraph").style.width =  String(TuningCar.engine + 1) + "vw";
    TuningCar.engine += 1;
    CostPurchase += CostUpgrade;
    ShowPurchaseFututre();
  }
}

function transmissionDec() {
  if (TuningCar.transmission > 1){
    document.getElementById("transmissionCnt").innerHTML = String(TuningCar.transmission - 1);
    document.querySelector(".FutureMaxSpeedGraph").style.width =  String(TuningCar.transmission - 1) + "vw";
    TuningCar.transmission -= 1;
    CostPurchase -= CostUpgrade;
    ShowPurchaseFututre();
  }
}

function transmissionInc() {
  if (TuningCar.transmission < 10){
    document.getElementById("transmissionCnt").innerHTML = String(TuningCar.transmission + 1);
    document.querySelector(".FutureMaxSpeedGraph").style.width =  String(TuningCar.transmission + 1) + "vw";
    TuningCar.transmission += 1;
    CostPurchase += CostUpgrade;
    ShowPurchaseFututre();
  }
}

function breaksDec() {
  if (TuningCar.breaks > 1){
    document.getElementById("breaksCnt").innerHTML = String(TuningCar.breaks - 1);
    document.querySelector(".FutureBrakingGraph").style.width =  String(TuningCar.breaks - 1) + "vw";
    TuningCar.breaks -= 1;
    CostPurchase -= CostUpgrade;
    ShowPurchaseFututre();
  }
}

function breaksInc() {
  if (TuningCar.breaks < 10){
    document.getElementById("breaksCnt").innerHTML = String(TuningCar.breaks + 1);
    document.querySelector(".FutureBrakingGraph").style.width =  String(TuningCar.breaks + 1) + "vw";
    TuningCar.breaks += 1;
    CostPurchase += CostUpgrade;
    ShowPurchaseFututre();
  }
}

function suspensionDec() {
  if (TuningCar.suspension > 1){
    document.getElementById("suspensionCnt").innerHTML = String(TuningCar.suspension - 1);
    document.querySelector(".FutureManeuverabilityGraph").style.width =  String(TuningCar.suspension - 1) + "vw";
    TuningCar.suspension -= 1;
    CostPurchase -= CostUpgrade;
    ShowPurchaseFututre();
  }
}

function suspensionInc() {
  if (TuningCar.suspension < 10){
    document.getElementById("suspensionCnt").innerHTML = String(TuningCar.suspension + 1);
    document.querySelector(".FutureManeuverabilityGraph").style.width =  String(TuningCar.suspension + 1) + "vw";
    TuningCar.suspension += 1;
    CostPurchase += CostUpgrade;
    ShowPurchaseFututre();
  }
}

function GarageCarDec() {
  if (carArrowCnt > 0) {
    GarageCars[carArrowCnt].IsChoosen = '0';
    carArrowCnt -= 1;
    while (GarageCars[carArrowCnt].Stock == '0'){
      carArrowCnt -= 1;
    }
    document.getElementById("currentCar").src = '/static/sprites/' + GarageCars[carArrowCnt].Scr + '.png';
    GarageCars[carArrowCnt].IsChoosen = '1';
    let xhrIsChoosen = new XMLHttpRequest();
    xhrIsChoosen.open("POST", "/api/chooseCar");
    xhrIsChoosen.send(JSON.stringify(String(carArrowCnt)));
    currentStyle();
    ShowPurchase();
  }
}

function GarageCarInc() {
  if (carArrowCnt < GarageCarsCount - 1) {
    GarageCars[carArrowCnt].IsChoosen = '0';
    carArrowCnt += 1;
    while (GarageCars[carArrowCnt].Stock == '0'){
      carArrowCnt += 1;
    }
    document.getElementById("currentCar").src = '/static/sprites/' + GarageCars[carArrowCnt].Scr + '.png';
    GarageCars[carArrowCnt].IsChoosen = '1';
    let xhrIsChoosen = new XMLHttpRequest();
    xhrIsChoosen.open("POST", "/api/chooseCar");
    xhrIsChoosen.send(JSON.stringify(String(carArrowCnt)));
    xhrIsChoosen.onload = () => {
      currentStyle();
      ShowPurchase();
    }
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
  document.getElementById("CostUpgrade").innerHTML = 'Upgrade cost: ' + CostPurchase; 
}

function ShowPurchase() {
  document.getElementById("engineCnt").innerHTML = Number(GarageCars[carArrowCnt].Engine);
  document.getElementById("transmissionCnt").innerHTML = Number(GarageCars[carArrowCnt].Transmission);
  document.getElementById("breaksCnt").innerHTML = Number(GarageCars[carArrowCnt].Breaks);
  document.getElementById("suspensionCnt").innerHTML = Number(GarageCars[carArrowCnt].Suspension);

  document.querySelector(".MaxSpeedGraph").style.width =  Number(GarageCars[carArrowCnt].Transmission) + "vw";
  document.querySelector(".FutureMaxSpeedGraph").style.width =  Number(GarageCars[carArrowCnt].Transmission) + "vw";
  document.querySelector(".AccelerationGraph").style.width =  Number(GarageCars[carArrowCnt].Engine) + "vw";
  document.querySelector(".FutureAccelerationGraph").style.width =  Number(GarageCars[carArrowCnt].Engine) + "vw";
  document.querySelector(".BrakingGraph").style.width =  Number(GarageCars[carArrowCnt].Breaks) + "vw";
  document.querySelector(".FutureBrakingGraph").style.width =  Number(GarageCars[carArrowCnt].Breaks) + "vw";
  document.querySelector(".ManeuverabilityGraph").style.width =  Number(GarageCars[carArrowCnt].Suspension) + "vw";
  document.querySelector(".FutureManeuverabilityGraph").style.width =  Number(GarageCars[carArrowCnt].Suspension) + "vw";

  TuningCar.transmission = Number(GarageCars[carArrowCnt].Transmission);
  TuningCar.engine = Number(GarageCars[carArrowCnt].Engine);
  TuningCar.breaks = Number(GarageCars[carArrowCnt].Breaks);
  TuningCar.suspension = Number(GarageCars[carArrowCnt].Suspension);
  CostPurchase = 0;
  document.getElementById("CostUpgrade").innerHTML = 'Upgrade cost: ' + CostPurchase; 
  NotMoney.style.display = "none";
}

function AcceptPurchase() {
  var str = document.getElementById("currentCar").src;
  str = str[str.length-6] + '/';
  if (String(TuningCar.transmission).length == 1){
    str += '0' + String(TuningCar.transmission);
  }
  else {
    str += String(TuningCar.transmission);
  }
  str += '/';
  if (String(TuningCar.engine).length == 1){
    str += '0' + String(TuningCar.engine);
  }
  else {
    str += String(TuningCar.engine);
  }
  str += '/';
  if (String(TuningCar.breaks).length == 1){
    str += '0' + String(TuningCar.breaks);
  }
  else {
    str += String(TuningCar.breaks);
  }
  str += '/';
  if (String(TuningCar.suspension).length == 1){
    str += '0' + String(TuningCar.suspension);
  }
  else {
    str += String(TuningCar.suspension);
  }
  str += '/';
  let xhrTuning = new XMLHttpRequest();
  xhrTuning.open("POST", "/api/buyStats");
  xhrTuning.send(JSON.stringify(str));
  xhrTuning.onload = () => {
    let answer = JSON.parse(xhrTuning.response);
    if (answer.response) {
      GarageCars[carArrowCnt].Transmission = String(TuningCar.transmission);
      GarageCars[carArrowCnt].Engine = String(TuningCar.engine);
      GarageCars[carArrowCnt].Breaks = String(TuningCar.breaks);
      GarageCars[carArrowCnt].Suspension = String(TuningCar.suspension);
      Money -= CostPurchase;
      document.getElementById("Money").innerHTML = 'Money: ' + Money;
      if (str.slice(1,14) == '/01/01/01/01/'){
        getAchive('9');
      }
      if (str.slice(1,14) == '/10/10/10/10/'){
        getAchive('10');
      }
      ShowPurchase();
    }
    else {
      ShowPurchase();
      NotMoney.style.display = "block";
      getAchive('13');
    }
  }
}