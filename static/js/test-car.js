const car = document.querySelector("#wroom")

addEventListener("keydown", moveForward)

function moveForward() {
    y = window.getComputedStyle(car).top
    x = window.getComputedStyle(car).left
    y=y.slice(0, -2)
    x=x.slice(0, -2)
    y=Number(y)
    x=Number(x)
    car.style.top = String(y+5)+'px'
}