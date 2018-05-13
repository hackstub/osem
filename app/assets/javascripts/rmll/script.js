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

// UTILS
function readJSONFile(url) {
    return new Promise((resolve, reject) => {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", url);
        rawFile.onload = () => {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                resolve(JSON.parse(rawFile.responseText));
            }
        }
        rawFile.onerror = () => reject("Couldn't find '" + url +"'");
        rawFile.send();
    });
}

// MAP FUNCTIONS



function initMap() {
  var map = new mapboxgl.Map({
      container: 'map',
      style: '/assets/rmll/map-style.json',
      center: [7.76399,48.576662],
      zoom: window.innerWidth > 700 ? 15.6 : 14.5,
      hash: true,
  });

  map.addControl(new mapboxgl.NavigationControl(), 'top-right');


}
