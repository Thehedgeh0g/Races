
const carousel = document.getElementById("carousel");
const designField = document.querySelector('.design-field');
let flagId = document.getElementById("opa"); // delete
let flagPaste = false;


function loadPuzzles() {

    const xhr = new XMLHttpRequest();
    
    xhr.open('GET', "/api/getSprites");

    xhr.addEventListener('load', () => {
        response = JSON.parse(xhr.responseText)
    });
  
  
    xhr.addEventListener('error', () => {
      console.log('error');
    });

}

loadPuzzles()


function setListOfPuzzles() {
    let ulList = carousel.querySelector('.gallery__ul');

    //for () {
        let listEl = document.createElement('li');
        let pzl = document.createElement('img');
        pzl.src = "";
        pzl.id = "";
        listEl.append(pzl);
        ulList.append(listEl);
//  } 
}


setListOfPuzzles();

const ulList = carousel.querySelectorAll('.gallery__ul li img');

function showCarousel() {

    let i = 1;
    for(let li of carousel.querySelectorAll('li')) {
        li.style.position = 'relative';
        li.insertAdjacentHTML('beforeend', `<span style="position:absolute;left:0;top:0">${i}</span>`);
        i++;
    }

    let width = 206; 
    let count = 3; 
    let list = carousel.querySelector('ul');
    let listElems = carousel.querySelectorAll('li');
    let position = 0; 

    carousel.querySelector('.prev').onclick = function() {
        position += width * count;
        position = Math.min(position, 0)
        list.style.marginLeft = position + 'px';
    };

    carousel.querySelector('.next').onclick = function() {
        position -= width * count;
        position = Math.max(position, -width * (listElems.length - count));
        list.style.marginLeft = position + 'px';
    };

}

showCarousel();

function selectedPuzzle() {

    for (let i=0; i < ulList.length; i++) {
        console.log(i, ulList[i].src);
        ulList[i].addEventListener("click", function () {
            flagId = document.getElementById(this.id);
            flagPaste = true;
        });
    }
}

selectedPuzzle();

function fillDesignField() {
    
    for (let i = 0; i < 225; i++) {
        let pzl = document.createElement('img');
        pzl.style.width = '60px';
        pzl.style.height = '60px';
        pzl.src = '../static/map tiles sprites/NE0.png'
        pzl.id = `pzl-${i + 1}`;

        pzl.addEventListener("click", function() {
            if (flagPaste) {
                this.src = flagId.src
            }
        });

        designField.append(pzl);
    }
}

fillDesignField();







