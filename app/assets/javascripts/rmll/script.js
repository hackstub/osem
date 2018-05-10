window.onload = function () {
  if (window.innerWidth >= 730) {
    document.getElementById("main-menu").setAttribute("role", "menubar");
  }

  var menus = document.querySelectorAll("nav li a");
  for (var i = menus.length-1; i >= 0; i--) {
    menus[i].addEventListener("focus", displayMenu);
    menus[i].addEventListener("mouseover", displayMenu);
  }
  document.getElementsByTagName("nav")[0].addEventListener("keydown", menuKeyHandler);
  document.onclick = function (e) {
    if (!document.getElementsByTagName("nav")[0].contains(e.target)) {
      hideMenu();
    }
  }
}

function displayMenu(e) {
  var toShow = e.target.nextElementSibling || e.target.parentElement.parentElement;
  if (toShow && toShow.classList.contains("dropdown")) {
    hideMenu();
    while (toShow && toShow.parentElement.parentElement.nodeName === "UL") {
      toShow.classList.add("show");
      toShow.setAttribute("aria-hidden", "false");
      toShow.parentElement.setAttribute("aria-expanded", "true");
      toShow = toShow.parentElement.parentElement;
    }
  }
}

function hideMenu() {
  var showed = document.getElementsByClassName("show");
  for (var i = showed.length-1; i >= 0; i--) {
    showed[i].setAttribute("aria-hidden", "true");
    showed[i].parentElement.setAttribute("aria-expanded", "false");
    showed[i].classList.remove("show");
  }
}

function menuKeyHandler(e) {
  var key = e.key || e.keyIdentifier || e.keyCode;
  var parent = e.target.parentElement.parentElement;
  var type = parent.getAttribute("role");
  var nextSibling = e.target.parentElement.nextElementSibling;
  var previousSibling = e.target.parentElement.previousElementSibling;

  function getNext(elem) {
    if (elem.parentElement.nodeName === "NAV") {
      return elem.parentElement;
    } else if (elem.parentElement.nextElementSibling) {
      return elem.parentElement.nextElementSibling;
    } else {
      return getNext(elem.parentElement);
    }
  }

  function getPrevious(elem) {
    if (elem.id == "main-menu") {
      return elem.parentElement.parentElement;
    } else if (elem.parentElement.nodeName == "NAV") {
      return elem.parentElement.lastElementChild.lastElementChild;
    } else {
      return elem.parentElement;
    }
  }

  if (["ArrowLeft", "Left", 37].indexOf(key) > -1) {
    if (type == "menubar" && !previousSibling) {
      if (parent.previousElementSibling && parent.previousElementSibling.id == "left-menu") {
        if (window.innerWidth >= 730) {
          previousSibling = document.getElementById("main-menu").lastElementChild;
        } else {
          previousSibling = parent.previousElementSibling.lastElementChild;
        }
      } else {
          previousSibling = getPrevious(parent);
      }
    } else if (type == "menu") {
      previousSibling = getPrevious(parent);
    }
    previousSibling.querySelector("a").focus();
  } else if (["ArrowUp", "Up", 38].indexOf(key) > -1) {
    if (type == "menu") {
      if (previousSibling) {
        previousSibling.firstElementChild.focus();
      } else {
        parent.parentElement.firstElementChild.focus();
      }
    }
  } else if (["ArrowRight", "Right", 39].indexOf(key) > -1) {
    if (type == "menubar") {
      if (nextSibling && nextSibling.firstElementChild.id == "menu-button" && window.innerWidth >= 730) {
        nextSibling = nextSibling.firstElementChild.nextElementSibling;
      } else if (!nextSibling) {
        if (parent.id == "left-menu" && window.innerWidth < 730) {
          nextSibling = parent.nextElementSibling;
        } else {
          nextSibling = getNext(parent);
        }
      }
    } else if (type == "menu") {
      if (e.target.nextElementSibling) {
        nextSibling = e.target.nextElementSibling;
      } else {
        nextSibling = getNext(parent);
      }
    }
    nextSibling.querySelector("a").focus();
  } else if (["ArrowDown", "Down", 40].indexOf(key) > -1) {
    if (type == "menubar") {
      e.target.nextElementSibling.querySelector("a").focus();
    } else if (type == "menu") {
      if (nextSibling) {
        nextSibling.firstElementChild.focus();
      } else {
        parent.parentElement.firstElementChild.focus();
      }
    }
  }
}
