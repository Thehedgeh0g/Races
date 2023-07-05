var GAME = { 
    width: 1920, 
    height: 1080, 
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
var Car = new Image();
Car.src = '../static/sprites/abm_blue.png';
var CarPosX = -17*2; 
var CarPosY = -24*2; 
var speed = 0; 
var xspeed = 0; 
var yspeed = 0; 
var angle = 0; 

var xcanvas = 0;
var ycanvas = 0;

var wasd = { 
    w: 0, 
    a: 0, 
    s: 0, 
    d: 0, 
} 
initEventsListeners(); 
 
function drawBackground() { 
    canvasContext.fillStyle = GAME.background; 
    canvasContext.fillRect(0, 0, GAME.width, GAME.height); 
} 
 
function drawCar(image, x, y) { 
    canvasContext.rotate(angle);
    canvasContext.translate(-xcanvas, -ycanvas);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height); 
    canvasContext.translate(xcanvas, ycanvas);
    canvasContext.rotate(-angle);
    canvasContext.drawImage(image, x, y, 17*4, 24*4); 
} 
 
function UpdatePosition() { 

    canvasContext.rotate(angle); 
    canvasContext.translate(xspeed, yspeed); 
    canvasContext.rotate(-angle);
    xcanvas += xspeed;
    ycanvas += yspeed;
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
    window.addEventListener('keyup', onCanvasKeyUp); 
} 
 
function framesCountHandler() { 
    if (GAME.framesCnt === 120) { 
        GAME.framesCnt = 0; 
    } 
    ++GAME.framesCnt; 
} 
 
function onCanvasKey() { 
    if ((wasd.w == 1) && (wasd.d == 1) && (speed != 0)) { 
        if (speed < 5) 
        { 
            speed += 0.0625; 
            xspeed = Math.sin(angle)*speed; 
            yspeed = Math.cos(angle)*speed; 
            dial.innerHTML = speed; 
            xdial.innerHTML = xspeed; 
            ydial.innerHTML = yspeed; 
        } 
        angle -= 0.03; 
        anglehtml.innerHTML = angle; 
        canvasContext.rotate(0.03); 
    } 
    if (wasd.w == 1) { 
         
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
    if (wasd.s == 1) { 
         
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
    if ((wasd.d == 1) && (speed != 0)) { 
        angle -= 0.03; 
        anglehtml.innerHTML = angle; 
        canvasContext.rotate(0.03); 
         
    } 
    if ((wasd.a == 1) && (speed != 0)) { 
        angle += 0.03; 
        anglehtml.innerHTML = angle; 
        canvasContext.rotate(-0.03); 
    } 
 
} 
 
function onCanvasKeyUp(event) { 
    if (event.code === 'KeyW') { 
        wasd.w = 0; 
    } 
    if (event.code === 'KeyA') { 
        wasd.a = 0; 
    } 
    if (event.code === 'KeyS') { 
        wasd.s = 0; 
    } 
    if (event.code === 'KeyD') { 
        wasd.d = 0; 
    } 
    onCanvasKey(); 
} 
 
function onCanvasKeyDown(event) { 
    if (event.code === 'KeyW') {
wasd.w = 1; 
    } 
    if (event.code === 'KeyA') { 
        wasd.a = 1; 
    } 
    if (event.code === 'KeyS') { 
        wasd.s = 1; 
    } 
    if (event.code === 'KeyD') { 
        wasd.d = 1; 
    } 
    onCanvasKey(); 
} 
drawFrame();