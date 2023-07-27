const start = document.querySelector('button');
const cont = document.getElementById('cont');

function getLink(cb) {
    let XHR = new XMLHttpRequest();
    XHR.open('GET', '');

    XHR.addEventListener('load', () => {
        let response = JSON.parse(XHR.responseText);
        cb(response);
    });

    XHR.addEventListener('error', () => {
        console.log('err')
    });

    XHR.send();
}


start.addEventListener('click', e => {

    cont.style.visibility = "visible";
});

getLink(response => {
    console.log(response);
});