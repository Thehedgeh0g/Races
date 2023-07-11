
let isLoaded = false;
let tiles = [];
let GAME = { 
    width: 1440, 
    height: 1440, 
    background: 'grey', 
    framesCnt: 0, 
}
const mcarspeed = 4;
let rspeed = 0.03;
let mspeed = mcarspeed;
let accel = mspeed / 160;
let resist = accel / 4;
const pi1 = Math.PI
const pi2 = 1/2;
const ga = 0.1;
const gs = mspeed/5;
let canvas = document.getElementById('canvas');
let move = document.getElementById('move')
canvas.width = GAME.width; 
canvas.height = GAME.height; 
let canvasContext = canvas.getContext('2d');
canvasContext.imageSmoothingEnabled = false;
let Car = new Image();
Car.src = '../static//sprites/abm_blue.png';

const carW = 17;
const carH = 24;

let CarPosX = -carW*0.5; 
let CarPosY = (-carH*2)*0; 
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
const r1 = document.getElementById('r1');
const r2 = document.getElementById('r2');
const r3 = document.getElementById('r3');
const r4 = document.getElementById('r4');

const grassArr = [1, 2, 3, 4];
const roadArr = [11, 10, 9, 8, 7, 6];
const borderArr = [12];

function drawFrame() {
    onCanvasKey();
    UpdatePosition();

    drawCar(Car, CarPosX, CarPosY); 
    framesCountHandler(); 
    requestAnimationFrame(drawFrame);
}

function UpdatePosition() {
    bFlag = false;
    updateReduce();
    reduceSpeed();

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

    displayDots();

    xcanvas += xspeed;
    ycanvas += yspeed;

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

function drawCar(image, x, y) { 
    canvasContext.rotate(angle);
    canvasContext.translate(-xcanvas, -ycanvas);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height); 
    canvasContext.translate(xcanvas, ycanvas);
    canvasContext.rotate(-angle);
    canvasContext.drawImage(image, x, y, carW, carH);
} 

function divme(a, b){
    return (a - a%b)/b
}

function reduceSpeed() {
    if (speed > 0) {
        if (speed-accel <= mspeed) {
            if ((speed - resist) > 0){
                speed -= resist; 
            } else {
                speed = 0;
            }
            xspeed = Math.sin(angle)*speed; 
            yspeed = Math.cos(angle)*speed; 
        } else {
            if ((speed - ga) > 0){
                speed -= ga; 
            } else {
                speed = 0;
            }
            xspeed = Math.sin(angle)*speed; 
            yspeed = Math.cos(angle)*speed; 
        }

    } 
    if (speed < 0) { 
        if (speed+accel >= -mspeed) {
            if ((speed + resist) < 0){
                speed += resist; 
            } else {
                speed = 0;
            }
        } else {
            if ((speed + ga) < 0){
                speed += ga; 
            } else {
                speed = 0;
            }
            xspeed = Math.sin(angle)*speed; 
            yspeed = Math.cos(angle)*speed; 
        }
    } 
}

function updateReduce() {
    if (isLoaded) {
        curTile = Number(tiles[(224-(divme(x, 96) + divme(y, 96) * 15))]);
        //console.log(curTile);
        
        if (grassArr.includes(curTile)) {
            //console.log('TRAVA')
            rspeed = 0.03;
            mspeed = gs;
            accel = mspeed / 160;
            resist = accel / 4;
            bFlag = false;
        } 
        if (roadArr.includes(curTile)) {
            //console.log('ASPHALT')
            rspeed = 0.03;
            mspeed = mcarspeed;
           
            accel = mspeed / 160;
            resist = accel / 4;
            bFlag = false;
        }
        if (borderArr.includes(curTile) && !bFlag) {
            //console.log('BORDER');
            angle += Math.PI;
            canvasContext.rotate(Math.PI);
            xspeed *= -1;
            yspeed *= -1;
            bFlag = true;
        }
    }
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
            angle -= rspeed; 
            canvasContext.rotate(rspeed);          
        } else {
            angle -= rspeed * Math.sin(pi2 * speed); 
            canvasContext.rotate(rspeed * Math.sin(pi2 * speed));
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
            angle += rspeed; 
            canvasContext.rotate(-rspeed);        
        } else {
            angle += rspeed * Math.sin(pi2 * speed); 
            canvasContext.rotate(-rspeed * Math.sin(pi2 * speed));
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
            angle += rspeed; 
            canvasContext.rotate(-rspeed);          
        } else {
            angle += rspeed * Math.sin(-pi2 * speed); 
            canvasContext.rotate(-rspeed * Math.sin(-pi2 * speed)); 
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
            angle -= rspeed; 
            canvasContext.rotate(rspeed);          
        } else {
            angle -= rspeed * Math.sin(-pi2 * speed); 
            canvasContext.rotate(rspeed * Math.sin(-pi2 * speed)); 
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

function scrollToCenter() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const documentWidth = document.documentElement.scrollWidth;
    const documentHeight = document.documentElement.scrollHeight;
  
    const scrollHorizontalTo = Math.max(0, (documentWidth - windowWidth) / 2);
    const scrollVerticalTo = Math.max(0, (documentHeight - windowHeight) / 2);
  
    window.scrollTo({
      left: scrollHorizontalTo,
      top: scrollVerticalTo,
      behavior: 'smooth'
    });
  }

  function displayDots() {

    y = window.getComputedStyle(move).top;
    x = window.getComputedStyle(move).left;  
    y = y.slice(0, -2);
    x = x.slice(0, -2);
    y = Number(y);
    x = Number(x);

    O=[1440-x, 1440-y];
    D=[O[0]+Math.cos(angle)*(carW/2), O[1]-Math.sin(angle)*(carW/2)];
    A=[O[0]-Math.cos(angle)*(carW/2), O[1]+Math.sin(angle)*(carW/2)];
    C=[D[0]+Math.sin(angle)*carH, D[1]+Math.cos(angle)*carH];
    B=[A[0]+Math.sin(angle)*carH, A[1]+Math.cos(angle)*carH];
    console.log(A, B, C, D);
    r1.style.top = String(A[1]) + 'px';
    r1.style.left = String(A[0]) + 'px';
    r2.style.top = String(B[1]) + 'px';
    r2.style.left = String(B[0]) + 'px';
    r3.style.top = String(C[1]) + 'px';
    r3.style.left = String(C[0]) + 'px';
    r4.style.top = String(D[1]) + 'px';
    r4.style.left = String(D[0]) + 'px';
}

function getTiles() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/getKey');
    xhr.addEventListener('load', () => {
        mapping = xhr.responseText.slice(11, -2);
        console.log(mapping);
        tiles = mapping.split(' ');
        console.log(tiles);
        isLoaded = true;
    })
    xhr.send();
}

function prepareCanvas() {
    canvasContext.translate(GAME.width/2, GAME.height/2);
    xcanvas += GAME.width/2;
    ycanvas += GAME.height/2;
}

getTiles();
initEventsListeners(); 
prepareCanvas();
scrollToCenter();
drawFrame();