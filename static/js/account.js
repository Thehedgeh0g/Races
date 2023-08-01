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
      window.location.reload();
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
    reqList = response;
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
            <div class="accept" id="a` + i + `">accept</div>
            <div class="reject" id="r` + i + `">reject</div>
          </div>
        </div>`
        document.getElementById("a"+i).addEventListener("click", accept);
        document.getElementById("r"+i).addEventListener("click", reject);
      });
    
      
    }
    console.log(response)
  });

  xhr.send();
}

const friendList = document.getElementById("friend-list");

function getFriends() {
  friendList.innerHTML=""

  const xhr = new XMLHttpRequest();
  
  xhr.open('POST', "/api/getFriendList");
  xhr.addEventListener('load', () => {
    response = JSON.parse(xhr.responseText)
    reqList = response;
    for (let i=0; i < response.Requests.length; i++) {
      const xhr1 = new XMLHttpRequest();
  
      xhr1.open('POST', "/api/getOtherUser");
      xhr1.send(JSON.stringify(response.Requests[i].SenderID));
      xhr1.addEventListener('load', () => {
        response1 = JSON.parse(xhr1.responseText)
        console.log(response1);
        friendList.innerHTML = friendList.innerHTML + 
       `<div class="friend">
          <img class="middle-ava" src="` + response1.Sender.ImgPath + `">
          <div class="col">
              <span>name:` + response1.Sender.Nickname + `</span>
              <span>lvl:` + response1.Sender.Lvl + `</span>
          </div>
        </div>`
        document.getElementById("a"+i).addEventListener("click", accept);
        document.getElementById("r"+i).addEventListener("click", reject);
      });
    
      
    }
    console.log(response)
  });

  xhr.send();
}

function accept(ev) {
  cid = ev.target.id.slice(1);

  user = reqList.Requests[cid];
  user.Status = "1"

  const xhr = new XMLHttpRequest();
  xhr.open('POST', "/api/answerReq");
  xhr.send(JSON.stringify(user));
  xhr.addEventListener('load', () => {
    getReq();
    let temp = document.getElementById("friend-list").innerHTML;
    document.getElementById("friend-list").innerHTML = "";
    document.getElementById("friend-list").innerHTML = temp;
  });
}

function reject(ev) {
  cid = ev.target.id.slice(1);

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
});



