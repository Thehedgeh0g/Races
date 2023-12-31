var GAME = { 
    width: 1410, 
    height: 1410, 
    background: 'grey', 
    framesCnt: 0, 
 
} 
 
var canvas = document.getElementById('canvas'); 
canvas.width = GAME.width; 
canvas.height = GAME.height; 
var canvasContext = canvas.getContext('2d');
canvasContext.imageSmoothingEnabled = false;
var Car = new Image();
Car.src = 'car.png';
var CarPosX = -17*0.5; 
var CarPosY = (-24*2)*0; 
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
    canvasContext.drawImage(image, x, y, 17, 24); 
} 
 
function UpdatePosition() { 

    canvasContext.rotate(angle); 
    canvasContext.translate(xspeed, yspeed); 
    canvasContext.rotate(-angle);
    y = window.getComputedStyle(canvas).top;
    x = window.getComputedStyle(canvas).left;
    y = y.slice(0, -2);
    x = x.slice(0, -2);
    y = Number(y);
    x = Number(x);
    canvas.style.top = String(- yspeed + y) + 'px';
    canvas.style.left =  String(- xspeed + x) + 'px';
    xcanvas += xspeed;
    ycanvas += yspeed;
} 
 
 
function drawFrame() { 
    if (speed > 0) { 
        speed -= 0.015625/4; 
        xspeed = Math.sin(angle)*speed; 
        yspeed = Math.cos(angle)*speed; 
    } 
    if (speed < 0) { 
        speed += 0.015625/4; 
        xspeed = Math.sin(angle)*speed; 
        yspeed = Math.cos(angle)*speed; 
    } 
    canvasContext.clearRect(0, 0, GAME.width, GAME.height); 
    drawBackground(); 
    UpdatePosition(); 
    initEventsListeners(); 
    drawCar(Car, CarPosX, CarPosY); 
    framesCountHandler(); 
    requestAnimationFrame(drawFrame); 
} 
 
function initEventsListeners() { 
    window.addEventListener('keydown', onCanvasKeyDown); 
    window.addEventListener('keyup', onCanvasKeyUp); 
    onCanvasKey(); 
} 
 
function framesCountHandler() { 
    if (GAME.framesCnt === 120) { 
        GAME.framesCnt = 0; 
    } 
    ++GAME.framesCnt; 
} 
 
function onCanvasKey() { 
    if (wasd.w == 1) { 
         
        if (speed < 10/4) 
        { 
            speed += 0.0625/4; 
            xspeed = Math.sin(angle)*speed; 
            yspeed = Math.cos(angle)*speed; 
        } 
    } 
    if (wasd.s == 1) { 
         
        if (speed > -10/4) 
        { 
            speed -= 0.0625/4; 
            xspeed = Math.sin(angle)*speed; 
            yspeed = Math.cos(angle)*speed; 
        } 
    } 
    if ((wasd.d == 1) && (speed > 0)) { 
        if (speed >= Math.PI/4) {
            angle -= 0.03; 
            canvasContext.rotate(0.03);          
        } else {
            angle -= 0.03 * Math.sin(speed*2); 
            canvasContext.rotate(0.03 * Math.sin(speed*2));
        } 
        if (speed > 0) {
            speed -= 0.0625/2/4;
        }
        if (speed < 0) {
            speed += 0.0625/2/4;
        }
        xspeed = Math.sin(angle)*speed; 
        yspeed = Math.cos(angle)*speed; 
         
    } 
    if ((wasd.a == 1) && (speed > 0)) { 
        if (speed >= Math.PI/4) {
            angle += 0.03; 
            canvasContext.rotate(-0.03);        
        } else {
            angle += 0.03 * Math.sin(speed*2); 
            canvasContext.rotate(-0.03 * Math.sin(speed*2));
        }
        if (speed > 0) {
            speed -= 0.0625/2/4;
        }
        if (speed < 0) {
            speed += 0.0625/2/4;
        }
        xspeed = Math.sin(angle)*speed; 
        yspeed = Math.cos(angle)*speed; 
    } 
    if ((wasd.d == 1) && (speed < 0)) { 
        if (speed <= -Math.PI/4) {
            angle += 0.03; 
            canvasContext.rotate(-0.03);          
        } else {
            angle += 0.03 * Math.sin(-speed*2); 
            canvasContext.rotate(-0.03 * Math.sin(-speed*2)); 
        }
        if (speed > 0) {
            speed -= 0.0625/2/4;
        }
        if (speed < 0) {
            speed += 0.0625/2/4;
        }
        xspeed = Math.sin(angle)*speed; 
        yspeed = Math.cos(angle)*speed; 
         
    } 
    if ((wasd.a == 1) && (speed < 0)) { 
        if (speed <= -Math.PI/4) {
            angle -= 0.03; 
            canvasContext.rotate(0.03);          
        } else {
            angle -= 0.03 * Math.sin(-speed*2); 
            canvasContext.rotate(0.03 * Math.sin(-speed*2)); 
        }
        if (speed > 0) {
            speed -= 0.0625/2/4;
        }
        if (speed < 0) {
            speed += 0.0625/2/4;
        }
        xspeed = Math.sin(angle)*speed; 
        yspeed = Math.cos(angle)*speed; 
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
canvasContext.translate(GAME.width/2, GAME.height/2);
xcanvas += GAME.width/2;
ycanvas += GAME.height/2;
drawFrame();