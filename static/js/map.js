let GAME = { 
    width: 1410, 
    height: 1410, 
    background: 'grey', 
    framesCnt: 0, 
 
}

let mspeed = 15;
let accel = mspeed / 160;
let resist = accel / 4;
//const pi1 = Math.PI*(mspeed/5);
const pi1 = Math.PI
//const pi2 = 5/mspeed/2;
const pi2 = 1/2;

let canvas = document.getElementById('canvas');
let trashcar = document.getElementById('trash-car');

trashcar.width = GAME.width; 
trashcar.height = GAME.height; 
let TrashPosX = 450; 
let TrashPosY = 400;
let TrashSX = 40; 
let TrashSY = 40;
let TContext = trashcar.getContext('2d');
TContext.imageSmoothingEnabled = false;
let TCar = new Image();
TCar.src = '../sprites/debuff.png';



let move = document.getElementById('move')
canvas.width = GAME.width; 
canvas.height = GAME.height; 
let canvasContext = canvas.getContext('2d');
canvasContext.imageSmoothingEnabled = false;
let Car = new Image();
Car.src = '../sprites/abm_blue.png';
let CarPosX = -17*0.5; 
let CarPosY = (-24*2)*0; 
let speed = 0; 
let xspeed = 0; 
let yspeed = 0; 
let angle = 0; 

let xcanvas = 0;
let ycanvas = 0;

let wasd = { 
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
    TContext.drawImage(TCar, TrashPosX, TrashPosY , TrashSX, TrashSY); 
} 
 
function UpdatePosition() { 

    canvasContext.rotate(angle); 
    canvasContext.translate(xspeed, yspeed); 
    canvasContext.rotate(-angle);
    y = window.getComputedStyle(move).top;
    x = window.getComputedStyle(move).left;
    y = y.slice(0, -2);
    x = x.slice(0, -2);
    y = Number(y);
    x = Number(x);
    move.style.top = String(- yspeed + y) + 'px';
    move.style.left =  String(- xspeed + x) + 'px';
    xcanvas += xspeed;
    ycanvas += yspeed;
    if((xcanvas < (TrashPosX + TrashSX)) && (xcanvas > (TrashPosX)) && (ycanvas < (TrashPosY+TrashSY)) && (ycanvas > (TrashPosY))) {
        mspeed = 2;
        accel = mspeed / 160;
        resist = accel / 4;
    }
} 
 
 
function drawFrame() { 
    if (speed > 0) { 
        speed -= resist; 
        xspeed = Math.sin(angle)*speed; 
        yspeed = Math.cos(angle)*speed; 
    } 
    if (speed < 0) { 
        speed += resist; 
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
         
        if (speed < mspeed) 
        { 
            speed += accel; 
            xspeed = Math.sin(angle)*speed; 
            yspeed = Math.cos(angle)*speed; 
        } 
    } 
    if (wasd.s == 1) { 
         
        if (speed > -mspeed) 
        { 
            speed -= accel; 
            xspeed = Math.sin(angle)*speed; 
            yspeed = Math.cos(angle)*speed; 
        } 
    } 
    if ((wasd.d == 1) && (speed > 0)) { 
        if (speed >= pi1) {
            angle -= 0.03; 
            canvasContext.rotate(0.03);          
        } else {
            angle -= 0.03 * Math.sin(pi2 * speed); 
            canvasContext.rotate(0.03 * Math.sin(pi2 * speed));
        } 
        if (speed > 0) {
            speed -= resist;
        }
        if (speed < 0) {
            speed += resist;
        }
        xspeed = Math.sin(angle)*speed; 
        yspeed = Math.cos(angle)*speed; 
         
    } 
    if ((wasd.a == 1) && (speed > 0)) { 
        if (speed >= pi1) {
            angle += 0.03; 
            canvasContext.rotate(-0.03);        
        } else {
            angle += 0.03 * Math.sin(pi2 * speed); 
            canvasContext.rotate(-0.03 * Math.sin(pi2 * speed));
        }
        if (speed > 0) {
            speed -= resist;
        }
        if (speed < 0) {
            speed += resist;
        }
        xspeed = Math.sin(angle)*speed; 
        yspeed = Math.cos(angle)*speed; 
    } 
    if ((wasd.d == 1) && (speed < 0)) { 
        if (speed <= -pi1) {
            angle += 0.03; 
            canvasContext.rotate(-0.03);          
        } else {
            angle += 0.03 * Math.sin(-pi2 * speed); 
            canvasContext.rotate(-0.03 * Math.sin(-pi2 * speed)); 
        }
        if (speed > 0) {
            speed -= resist;
        }
        if (speed < 0) {
            speed += resist;
        }
        xspeed = Math.sin(angle)*speed; 
        yspeed = Math.cos(angle)*speed; 
         
    } 
    if ((wasd.a == 1) && (speed < 0)) { 
        if (speed <= -pi1) {
            angle -= 0.03; 
            canvasContext.rotate(0.03);          
        } else {
            angle -= 0.03 * Math.sin(-pi2 * speed); 
            canvasContext.rotate(0.03 * Math.sin(-pi2 * speed)); 
        }
        if (speed > 0) {
            speed -= resist;
        }
        if (speed < 0) {
            speed += resist;
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