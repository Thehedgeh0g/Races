var GAME = {
    width: 1500,
    height: 720,
    background: 'white',
    framesCnt: 0,

}

var dial = document.getElementById('dial')
var xdial = document.getElementById('xdial')
var ydial = document.getElementById('ydial')
var anglehtml = document.getElementById('angle')
var canvas = document.getElementById('canvas');
canvas.width = GAME.width;
canvas.height = GAME.height;
const image = document.getElementById('img');
var canvasContext = canvas.getContext('2d');
var Car = new Image(); //изображение
Car.src = '../static/sprites/abm_blue.png';//подключение изображения
var CarPosX = -17*2;
var CarPosY = -24*2;
var speed = 0;
var xspeed = 0;
var yspeed = 0;
var angle = 0;

initEventsListeners();

function drawBackground() {
    canvasContext.fillStyle = GAME.background;
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);
}

function drawCar(image, x, y) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.drawImage(image, x, y, 17*4, 24*4);
}

function UpdatePosition() {
    //CarPosY -= xspeed;
    //CarPosX -= yspeed;
    canvasContext.rotate(angle);
    canvasContext.translate(xspeed, yspeed);
    canvasContext.rotate(-angle);
}


function drawFrame() {
    if (speed > 0) {
        speed -= 0.015625;
        xspeed = Math.sin(angle)*speed;
        yspeed = Math.cos(angle)*speed;
        dial.innerHTML = speed;
        xdial.innerHTML = xspeed;
        ydial.innerHTML = yspeed;
    }
    if (speed < 0) {
        speed += 0.015625;
        xspeed = Math.sin(angle)*speed;
        yspeed = Math.cos(angle)*speed;
        dial.innerHTML = speed;
        xdial.innerHTML = xspeed;
        ydial.innerHTML = yspeed;
    }
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    UpdatePosition();
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
            xspeed = Math.sin(angle)*speed;
            yspeed = Math.cos(angle)*speed;
            dial.innerHTML = speed;
            xdial.innerHTML = xspeed;
            ydial.innerHTML = yspeed;
        }
    }
    if ((event.key === 's') || (event.key === 'ы')) {
        
        if (speed > -5)
        {
            speed -= 0.0625;
            xspeed = Math.sin(angle)*speed;
            yspeed = Math.cos(angle)*speed;
            dial.innerHTML = speed;
            xdial.innerHTML = xspeed;
            ydial.innerHTML = yspeed;
        }
    }
    if (((event.key === 'd') || (event.key === 'в')) && (speed != 0)) {
        angle -= 0.03;
        anglehtml.innerHTML = angle;
        canvasContext.rotate(0.03);
        
    }
    if (((event.key === 'a') || (event.key === 'ф')) && (speed != 0)) {
        angle += 0.03;
        anglehtml.innerHTML = angle;
        canvasContext.rotate(-0.03);
    }

}
drawFrame();