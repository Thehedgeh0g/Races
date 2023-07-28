const achive = document.getElementById("achive");
const achiveImg = document.getElementById("achive__img");
const achiveTitle = document.getElementById("achive__title");
const achiveSubtitle = document.getElementById("achive__subtitle");
const achiveSteps = document.getElementById("achive__steps");

function showAchive(imgSrc, title, subtitle, steps) {
  achiveImg.src = imgSrc;
  achiveTitle.innerHTML = title;
  achiveSubtitle.innerHTML = subtitle;
  achiveSteps.innerHTML = steps;
  achive.style.width = "45vw";
  achive.style.borderWidth = "15px";
  setTimeout(removeAchive, 5000);s
}

function removeAchive() {
  achive.style.width = "0vw";
  achive.style.borderWidth = "0px";
}