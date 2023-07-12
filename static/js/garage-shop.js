const ShopField = document.getElementById("Shop");
const StyleField = document.getElementById("Style");

const GreyFutureCarField = document.getElementById("greyFutureCar");
const GreenFutureCarField = document.getElementById("greenFutureCar");
const RedFutureCarField = document.getElementById("redFutureCar");
const YellowFutureCarField = document.getElementById("yellowFutureCar");

const GreyCarField = document.getElementById("colorGreyCar");
const GreenCarField = document.getElementById("colorGreenCar");
const RedCarField = document.getElementById("colorRedCar");
const YellowCarField = document.getElementById("colorYellowCar");

ShopField.addEventListener("click", showShop);
StyleField.addEventListener("click", showStyle);

GreyFutureCarField.addEventListener("click", replaceCar);
GreenFutureCarField.addEventListener("click", replaceCar);
RedFutureCarField.addEventListener("click", replaceCar);
YellowFutureCarField.addEventListener("click", replaceCar);

GreyCarField.addEventListener("click", replaceCar);
GreenCarField.addEventListener("click", replaceCar);
RedCarField.addEventListener("click", replaceCar);
YellowCarField.addEventListener("click", replaceCar);

// var xhr = new XMLHttpRequest();
// xhr.open("GET", "");
// xhr.send();
// xhr.addEventListener("load", () =>{  })

function showShop() {
  document.querySelector(".style-field").style.visibility = "hidden";
  document.querySelector(".shop-field").style.visibility = "visible";
}

function showStyle() {
  document.querySelector(".shop-field").style.visibility = "hidden";
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