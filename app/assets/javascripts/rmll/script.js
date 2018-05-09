window.onload = function () {
  var menus = document.querySelectorAll("nav li a");
  for (var i = menus.length-1; i >= 0; i--) {
    menus[i].addEventListener("focus", displayMenu);
    menus[i].addEventListener("mouseover", displayMenu);
  }

  document.onclick = function (e) {
    if (!document.getElementsByTagName("nav")[0].contains(e.target)) {
      hideMenu();
    }
  }
}

function displayMenu(e) {
  var toShow = e.target.nextElementSibling;
  if (toShow && toShow.classList.contains("dropdown")) {
    hideMenu();
    while (toShow && toShow.parentElement.parentElement.nodeName === "UL") {
      toShow.classList.add("show");
      toShow.setAttribute("aria-hidden", "false");
      toShow = toShow.parentElement.parentElement;
    }
  }
}

function hideMenu() {
  var showed = document.getElementsByClassName("show");
  for (var i = showed.length-1; i >= 0; i--) {
    showed[i].setAttribute("aria-hidden", "true");
    showed[i].classList.remove("show");
  }
}
