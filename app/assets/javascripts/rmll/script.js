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
  var showed = document.querySelectorAll("nav .show");
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

  // UTILS
  function readJSONFile(url, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", url);
    rawFile.onload = () => {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(JSON.parse(rawFile.responseText));
      }
    }
    rawFile.onerror = () => reject("Couldn't find '" + url +"'");
    rawFile.send();
  }

  // MAP FUNCTIONS
  function initMap() {
    var map = new mapboxgl.Map({
      container: 'map',
      style: '/assets/rmll/map-style.json',
      center: [7.76399,48.576662],
      zoom: window.innerWidth > 700 ? 13.5 : 14.5,
      hash: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    var marker = new mapboxgl.Marker()
    .setLngLat([7.76399, 48.576662])
    .addTo(map);
    var markerHeight = 50, markerRadius = 10, linearOffset = 25;
    var popupOffsets = {
      'top': [0, 0],
      'top-left': [0,0],
      'top-right': [0,0],
      'bottom': [0, -markerHeight],
      'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
      'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
      'left': [markerRadius, (markerHeight - markerRadius) * -1],
      'right': [-markerRadius, (markerHeight - markerRadius) * -1]
    };

    var popup = new mapboxgl.Popup({offset:popupOffsets})
    .setLngLat([7.76399, 48.576662])
    .setHTML("yolo")
    .addTo(map);

    readJSONFile("/assets/rmll/map-extra.json", function (layers) {
      map.on('load', function () {
        map.addLayer({
          "id": "batiments",
          "type": "fill",
          "source": {
            "type": "geojson",
            "data": layers.batiments
          },
          "layout": {},
          "paint": {
            "fill-color": "#FF0000",
            "fill-opacity": 1
          }
        });

        map.addLayer({
          "id": "tram",
          "type": "symbol",
          "source": {
            "type": "geojson",
            "data": layers.tramStops
          },
          "minzoom": 14,
          "layout": {
            'visibility': 'visible',
            "text-size": 11,
            "text-font": [
              "Noto Sans Bold"
            ],
            "text-offset": [
              0,
              0.5
            ],
            "icon-size": 1,
            "text-anchor": "bottom",
            "text-field": "{name}",
            "text-max-width": 8,
            "text-line-height": 1.2,
            "text-padding": 2,
            "text-letter-spacing": 0,
            "text-transform": "uppercase"
          },
          "paint": {
            "text-color": "rgba(255, 255, 255, 1)",
            "text-halo-width": 10,
            "text-halo-color": "rgba(255, 0, 0, 1)",
            "text-halo-blur": 0,
            "icon-halo-width": 0,
            "icon-halo-color": "rgba(0, 0, 0, 0)",
            "icon-color": "rgba(0, 0, 0, 1)"
          }
        });

        map.addLayer({
          "id": "buildingNames",
          "type": "symbol",
          "source": {
            "type": "geojson",
            "data": layers.buildingNames
          },
          "minzoom": 14,
          "layout": {
            "text-size": 11,
            "text-font": [
              "Noto Sans Bold"
            ],
            "text-offset": [
              0,
              0.5
            ],
            "icon-size": 1,
            "text-anchor": "bottom",
            "text-field": "{name}",
            "text-max-width": 8,
            "text-line-height": 1.2,
            "text-padding": 2,
            "text-letter-spacing": 0,
            "text-transform": "uppercase"
          },
          "paint": {
            "text-color": "rgba(255, 255, 255, 1)",
            "text-halo-width": 50,
            "text-halo-color": "rgba(0, 0, 0, 1)",
            "text-halo-blur": 0,
            "icon-halo-width": 0,
            "icon-halo-color": "rgba(0, 0, 0, 0)",
            "icon-color": "rgba(0, 0, 0, 1)"
          }
        });
      });
    });

    return map
}
