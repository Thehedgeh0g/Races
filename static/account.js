const friendsListToggler = document.getElementById("FriendsListToggler");
const friendsData = document.querySelector(".friends-data");
const friendsListTogglerClassList = document.querySelector(".friends-list__toggler");

friendsListToggler.addEventListener("click", function() {
  if (friendsData.style.display === "none" || friendsData.style.display === "") {
    
    friendsListTogglerClassList.style.transform = "rotate(360deg)";
    friendsData.style.display = "block";

  } else {
    friendsData.style.display = "none";
    friendsListTogglerClassList.style.transform = "rotate(270deg)";
  }
});

