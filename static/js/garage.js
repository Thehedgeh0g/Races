const ShopField = document.getElementById("Shop");
const TuningField = document.getElementById("Tuning");
const StyleField = document.getElementById("Style");

const GreyFutureCarField = document.getElementById("greyFutureCar");
const GreenFutureCarField = document.getElementById("greenFutureCar");
const RedFutureCarField = document.getElementById("redFutureCar");
const YellowFutureCarField = document.getElementById("yellowFutureCar");

const GreyCarField = document.getElementById("colorGreyCar");
const GreenCarField = document.getElementById("colorGreenCar");
const RedCarField = document.getElementById("colorRedCar");
const YellowCarField = document.getElementById("colorYellowCar");

const engineArrowLeft = document.getElementById("engineArrowLeft");
const engineArrowRight = document.getElementById("engineArrowRight");

var engineCnt = 1;
document.getElementById("engineCnt").innerHTML = engineCnt;



ShopField.addEventListener("click", showShop);
TuningField.addEventListener("click", showTuning);
StyleField.addEventListener("click", showStyle);

GreyFutureCarField.addEventListener("click", replaceCar);
GreenFutureCarField.addEventListener("click", replaceCar);
RedFutureCarField.addEventListener("click", replaceCar);
YellowFutureCarField.addEventListener("click", replaceCar);

GreyCarField.addEventListener("click", replaceCar);
GreenCarField.addEventListener("click", replaceCar);
RedCarField.addEventListener("click", replaceCar);
YellowCarField.addEventListener("click", replaceCar);

engineArrowLeft.addEventListener("click", engineDec);
engineArrowRight.addEventListener("click", engineInc);


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

function replaceCar() {
  if (this == GreyFutureCarField){
    document.getElementById("currentCar").src = document.getElementById('greyCar').src;
  }
  if (this == GreenFutureCarField){
    document.getElementById("currentCar").src = document.getElementById('greenCar').src;
  }
  if (this == RedFutureCarField){
    document.getElementById("currentCar").src = document.getElementById('redCar').src;
  }
  if (this == YellowFutureCarField){
    document.getElementById("currentCar").src = document.getElementById('yellowCar').src;
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
}

function engineDec() {
  if (engineCnt > 1){
    document.getElementById("engineCnt").innerHTML = String(engineCnt - 1);
    document.querySelector(".MaxSpeedGraph").style.width =  String(engineCnt - 1) + "vw";
    engineCnt -= 1;
  }
}

function engineInc() {
  if (engineCnt < 10){
    document.getElementById("engineCnt").innerHTML = String(engineCnt + 1);
    document.querySelector(".MaxSpeedGraph").style.width =  String(engineCnt + 1) + "vw";
    engineCnt += 1;
  }
}