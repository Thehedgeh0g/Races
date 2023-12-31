const friendsListToggler = document.getElementById("FriendsListToggler");
const friendsData = document.querySelector(".friends-data");
const friendsListTogglerClassList = document.querySelector(".friends-list__toggler");
const friendsCounter = document.getElementById("FriendsCounter");
const addFriendForm = document.getElementById("AddFriendForm");
const searchFriendButton = document.getElementById("SearchFriendButton");
const addFriends = document.getElementById("AddFriend");
const closeButton = document.getElementById("CloseButton");
const addFriendInput = document.getElementById("AddFriendInput");
const achiToggler = document.getElementById("AchiToggler");
const achiTogglerClassList = document.querySelector(".achievements-list__toggler");
const achiCounter = document.getElementById("AchiCounter");
const achiData = document.querySelector(".achi-data");

let user = {
  "Nick": null
}

// добавление друга

addFriends.addEventListener("click", showAddFriendBox);

function showAddFriendBox() {
  addFriendClick();
  darkenScreen();
}

function addFriendClick() {
  document.querySelector(".add-friend-box").style.visibility = "visible";
}

let overlay = document.createElement("div");

function darkenScreen() {
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);
}

closeButton.addEventListener("click", function() {
  document.body.removeChild(overlay);
  document.querySelector(".add-friend-box").style.visibility = "hidden";
})


function changeBorderColor() { 
  searchFriendButton.style.border = "0.3vh solid #eb6126";
}

function returnBorderColor() {
  searchFriendButton.style.border = "0.3vh solid #a88312";
}

searchFriendButton.addEventListener("mouseover", changeBorderColor);
searchFriendButton.addEventListener("mouseout", returnBorderColor);



// отправка NickName на сервер



addFriendForm.addEventListener("submit", addFriendInputSubmit);
searchFriendButton.addEventListener("click", addFriendInputSubmit);

function addFriendInputSubmit(event) {

  event.preventDefault();
  
  checkIsValidFriend(addFriendInput.value);
}

function checkIsValidFriend(userName) {
  user.Nick = userName;
  const xhr = new XMLHttpRequest();
  
  xhr.open('POST', "/api/addFriend");
  xhr.addEventListener('load', () => {
    response = JSON.parse(xhr.responseText)
    if (response.IsFound == true){
      document.body.removeChild(overlay);
      document.querySelector(".add-friend-box").style.visibility = "hidden";
      socket.send(JSON.stringify(response.FriendsID + " reload"));
    }
    console.log(response)
  });


  xhr.addEventListener('error', () => {
    console.log('error');
  });
  console.log(user)
  console.log(JSON.stringify(user))
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(JSON.stringify(user));
}

let reqList = null;

const requests = document.getElementById("req");

function getReq() {

  requests.innerHTML=""

  const xhr = new XMLHttpRequest();
  
  xhr.open('POST', "/api/getReqList");
  xhr.addEventListener('load', () => {
    response = JSON.parse(xhr.responseText)
    console.log(response);
    reqList = response;
    if (response.Requests == null) {
      requests.innerHTML = "You have no friend requests (T-T)"
      return
    }
    for (let i=0; i < response.Requests.length; i++) {
      const xhr1 = new XMLHttpRequest();
  
      xhr1.open('POST', "/api/getOtherUser");
      xhr1.send(JSON.stringify(response.Requests[i].SenderID));
      xhr1.addEventListener('load', () => {
        response1 = JSON.parse(xhr1.responseText)
        console.log(response1);
        requests.innerHTML = requests.innerHTML + 
       `<div class=req-field>
          <div class="human">
            <img class="small-ava" src="` + response1.Sender.ImgPath + `">
            <span>` + response1.Sender.Nickname + `</span>
          </div>
          <div class="choose">
            <div class="accept" id="a` + i + `" onClick='accept(id)'>accept</div>
            <div class="reject" id="r` + i + `" onClick='reject(id)'>reject</div>
          </div>
        </div>`
        // document.getElementById("a"+i).addEventListener("click", accept);
        // document.getElementById("r"+i).addEventListener("click", reject);
      });
    
      
    }
    
  });

  xhr.send();
}

const friendList = document.getElementById("friend-list");

function getFriends() {
  friendList.innerHTML=""

  const xhr = new XMLHttpRequest();
  
  xhr.open('GET', "/api/getFriends");
  xhr.addEventListener('load', () => {
    console.log(xhr.responseText)
  response = JSON.parse(xhr.responseText)
  console.log(response);
  if (response.Friends.length == 0) {
    friendList.innerHTML = "You have no friends (T-T)"
    return
  }
    for (let i = 0; i < response.Friends.length; i++) {
      const xhr1 = new XMLHttpRequest();
  
      xhr1.open('POST', "/api/getOtherUser");
      xhr1.send(JSON.stringify(response.Friends[i]));
      xhr1.addEventListener('load', () => {
        response1 = JSON.parse(xhr1.responseText)
        console.log(response1);
        friendList.innerHTML = friendList.innerHTML + 
       `<div class="friend">
          <img class="middle-ava" src="` + response1.Sender.ImgPath + `">
          <div class="col">
              <span>` + response1.Sender.Nickname + `</span>
              <span>lvl:` + (response1.Sender.Lvl - response1.Sender.Lvl % 100) / 100 + `</span>
          </div>
          <div class="del" id=` + response1.Sender.Nickname + ':' + response1.Sender.Id + `  onClick='deleteFriend(id)'></div>
        </div>`
        // document.getElementById(response1.Sender.Nickname + ":" + response1.Sender.Id).addEventListener("click", deleteFriend)
      });
    }
  });

  xhr.send();
}

function deleteFriend(ev) {
  cid = ev.split(':')[0];

  const xhr = new XMLHttpRequest();
  xhr.open('POST', "/api/deleteFriend");
  xhr.send(JSON.stringify(cid));
  xhr.addEventListener('load', () => {
    getReq();
    getFriends();
    socket.send(JSON.stringify(ev.split(':')[1] + " reload"));
    console.log(JSON.stringify(ev.split(':')[1] + " reload"));
  });
}

function accept(ev) {
  cid = ev.slice(1);

  user = reqList.Requests[cid];
  user.Status = "1"

  const xhr = new XMLHttpRequest();
  xhr.open('POST', "/api/answerReq");
  xhr.send(JSON.stringify(user));
  xhr.addEventListener('load', () => {
    getReq();
    getFriends();
    socket.send(JSON.stringify(reqList.Requests[cid].SenderID + " reload"));
    console.log(JSON.stringify(reqList.Requests[cid].SenderID + " reload"));
  });
}

function reject(ev) {
  cid = ev.slice(1);

  user = reqList.Requests[cid];
  user.Status = "2"

  const xhr = new XMLHttpRequest();
  xhr.open('POST', "/api/answerReq");
  xhr.send(JSON.stringify(user));
  xhr.addEventListener('load', () => {
    getReq();
  });
}

window.addEventListener('load', () => {
  getReq();
  getFriends();
  console.log(document.getElementById("ach").innerHTML.split('  ').join('').split(' ').join('').split('\r').join('').split('\n').join(''))
  if (document.getElementById("ach").innerHTML.split('  ').join('').split(' ').join('').split('\r').join('').split('\n').join('') == "") {
    console.log("fffff")
    document.getElementById("ach").innerHTML = 'You have no achivments xD'
  }
});



var socket = new WebSocket("wss:" + window.location.hostname + "/aws");

socket.onmessage = function (event) {
  var message = JSON.parse(event.data);
  console.log(message);
  getReq();
  getFriends();
};

socket.addEventListener("open", () => {
  socket.send(JSON.stringify("0"));
});





let musicOff = true;
document.body.addEventListener("mousemove", playMusic);
document.body.addEventListener("canplaythrough", playMusic);

function playMusic(){
  if (musicOff){
    musicOff = false;
    let audio = new Audio();
    audio.volume = 0.3;
    var musicFolder = '../static/music/account/';
    var music = new Array('InitialD-APerfectHero_(muzmo.su).mp3', 'INITIALD-INeedYourLove_(muzmo.su).mp3', 'InitialD-KillingMyLove_(muzmo.su).mp3');
    var rand_file_index = Math.round(Math.random()*(music.length-1));
    var rand_file_name = music[rand_file_index];
    console.log(rand_file_name);
    audio.src = musicFolder + rand_file_name;
    audio.play();
  }
}

const BackToMenu = document.getElementById("menu");

BackToMenu.addEventListener('click', ()=> {
  window.location.href = "/menu"
});