const triangle = document.getElementById('triangle');
const list = document.getElementById('list');

let flag = false;

triangle.addEventListener('click', mapList);

function mapList() {
    if (!flag) {
        list.style.height = '35vh';
        flag = true;
    } else {
        list.style.height = '0vh';
        flag = false;
    }
    
}