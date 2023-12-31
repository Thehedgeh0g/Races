var GAME = {
    width: 1500,
    height: 720,
    background: 'white',
    framesCnt: 0,

}

var dial = document.getElementById('dial')
var canvas = document.getElementById('canvas');
canvas.width = GAME.width;
canvas.height = GAME.height;
const image = document.getElementById('img');
var canvasContext = canvas.getContext('2d');
var Car = new Image(); //изображение
Car.src = '../static/sprites/abm_blue.png';//подключение изображения
var CarPosX = 100;
var CarPosY = 300;
var speed = 0;
var angle = 0;

initEventsListeners();

function drawBackground() {
    canvasContext.fillStyle = GAME.background;
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);
}

function drawCar(image, x, y) {
    canvasContext.drawImage(image, x, y, 17*4, 24*4);
}

function UpdateSpeed() {
    CarPosY -= speed;

}


function drawFrame() {
    if (speed > 0) {
        speed -= 0.015625;
        dial.innerHTML = speed;
    }
    if (speed < 0) {
        speed += 0.015625;
        dial.innerHTML = speed;
    }
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    UpdateSpeed();
    drawCar(Car, CarPosX, CarPosY);
    framesCountHandler();
    requestAnimationFrame(drawFrame);
}

function initEventsListeners() {
    window.addEventListener('keydown', onCanvasKeyDown);
}

function framesCountHandler() {
    if (GAME.framesCnt === 120) {
        GAME.framesCnt = 0;
    }
    ++GAME.framesCnt;
}

function onCanvasKeyDown(event) {
    if ((event.key === 'w') || (event.key === 'ц')) {
        
        if (speed < 5)
        {
            speed += 0.0625;
            dial.innerHTML = speed;
        }
    }
    if ((event.key === 's') || (event.key === 'ы')) {
        
        if (speed > -5)
        {
            speed -= 0.0625;
            dial.innerHTML = speed;
        }
    }
    if ((event.key === 'd') || (event.key === 'в')) {
        angle += 1;
        image.style.transform = `rotate(${angle}deg)`;
        drawFrame();
    }
    if ((event.key === 'a') || (event.key === 'ф')) {
        CarPosX -= 5;
        drawFrame();
    }

}
drawFrame();