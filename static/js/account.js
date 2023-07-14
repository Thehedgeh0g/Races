const friendsListToggler = document.getElementById("FriendsListToggler");
const friendsData = document.querySelector(".friends-data");
const friendsListTogglerClassList = document.querySelector(".friends-list__toggler");
const friendsCounter = document.getElementById("FriendsCounter");
const addFriendForm = document.getElementById("AddFriendForm");
const searchFriendButton = document.getElementById("SearchFriendButton");
const addFriends = document.getElementById("AddFriend");
const closeButton = document.getElementById("CloseButton");
const addFriendInput = document.getElementById("AddFriendInput");

friendsListToggler.addEventListener("click", function() {
  if (friendsData.style.display === "none" || friendsData.style.display === "") {
    
    friendsListTogglerClassList.style.transform = "rotate(360deg)";
    friendsData.style.display = "block";

  } else {
    friendsData.style.display = "none";
    friendsListTogglerClassList.style.transform = "rotate(270deg)";
  }
});


// подсчет друзей
let liElements = friendsData.querySelectorAll('li');
let countLi = liElements.length;
friendsCounter.innerHTML = countLi;


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

  let nickInput = addFriendInput.value;
  event.preventDefault();
  const nick = JSON.stringify(nickInput);
  checkIsValidFriend(nick);
}

function checkIsValidFriend(userName) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', "/api/addFriend");

  xhr.addEventListener('load', () => {
    
  });


  xhr.addEventListener('error', () => {
    console.log('error');
  });

  xhr.send(userName);
}

