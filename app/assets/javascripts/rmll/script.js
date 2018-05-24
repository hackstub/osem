window.onload = function () {
  if (window.innerWidth < 730) setupSmallMenu();
  var menubar = new Menubar(document.getElementsByTagName("nav")[0].children[0]);
  menubar.init();
  var menubar = new Menubar(document.getElementsByTagName("nav")[0].children[1]);
  menubar.init();
}

function setupSmallMenu() {
  var link = document.createElement("a");
  link.appendChild(document.createTextNode("Menu"));
  link.setAttribute("role", "menuitem");
  link.setAttribute("aria-haspopup", "true");
  link.setAttribute("aria-expanded", "false");
  link.setAttribute("tabindex", "-1");
  var subMenu = document.createElement("ul");
  subMenu.classList.add("dropdown", "dropdown-menu")
  subMenu.setAttribute("role", "menu")
  subMenu.setAttribute("aria-label", "Event information");

  var currentMenu = document.getElementById("left-menu");
  while (currentMenu.children.length > 1) {
    currentMenu.children[1].setAttribute("role", "none")
    subMenu.appendChild(currentMenu.children[1]);
  }

  var menu = document.createElement("li");
  menu.appendChild(link);
  menu.appendChild(subMenu);
  currentMenu.appendChild(menu);
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
