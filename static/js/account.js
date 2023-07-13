const friendsListToggler = document.getElementById("FriendsListToggler");
const friendsData = document.querySelector(".friends-data");
const friendsListTogglerClassList = document.querySelector(".friends-list__toggler");
const searchFriendButton = document.getElementById("SearchFriendButton");

friendsListToggler.addEventListener("click", function() {
  if (friendsData.style.display === "none" || friendsData.style.display === "") {
    
    friendsListTogglerClassList.style.transform = "rotate(360deg)";
    friendsData.style.display = "block";

  } else {
    friendsData.style.display = "none";
    friendsListTogglerClassList.style.transform = "rotate(270deg)";
  }
});


// добавление друга

const addFriends = document.getElementById("AddFriend");
const closeButton = document.getElementById("CloseButton");

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
