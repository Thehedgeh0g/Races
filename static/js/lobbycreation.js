const start = document.querySelector('button');
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
    getLink(response => {
        console.log(response);
    });
});