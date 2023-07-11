const ShopField = document.getElementById("Shop");
const GreyCarField = document.getElementById("greyFutureCar");
const GreenCarField = document.getElementById("greenFutureCar");
const RedCarField = document.getElementById("redFutureCar");
const YellowCarField = document.getElementById("yellowFutureCar");

ShopField.addEventListener("click", showShop);
GreyCarField.addEventListener("click", replaceCar);
GreenCarField.addEventListener("click", replaceCar);
RedCarField.addEventListener("click", replaceCar);
YellowCarField.addEventListener("click", replaceCar);

function showShop() {
  document.querySelector(".shop-field").style.visibility = "visible";
}

function replaceCar() {
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