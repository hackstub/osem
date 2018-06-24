initMap();

// MAP FUNCTIONS
function initMap() {
  var map = new mapboxgl.Map({
    container: 'map',
    style: mapStyleURL,
    center: [7.76399,48.576662],
    zoom: window.innerWidth > 700 ? 14 : 14.5,
    hash: true,
  });

  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  // var marker = new mapboxgl.Marker()
  // .setLngLat([7.76399, 48.576662])
  // .addTo(map);
  // var markerHeight = 50, markerRadius = 10, linearOffset = 25;
  // var popupOffsets = {
  //   'top': [0, 0],
  //   'top-left': [0,0],
  //   'top-right': [0,0],
  //   'bottom': [0, -markerHeight],
  //   'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  //   'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  //   'left': [markerRadius, (markerHeight - markerRadius) * -1],
  //   'right': [-markerRadius, (markerHeight - markerRadius) * -1]
  // };

  // var popup = new mapboxgl.Popup({offset:popupOffsets})
  // .setLngLat([7.76399, 48.576662])
  // .setHTML("yolo")
  // .addTo(map);

  readJSONFile(mapExtraURL, function (layers) {
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


function checkboxes() {
// setup click listener to checkboxes
var boxes = document.getElementsByTagName("input");
for(var i = boxes.length - 1; i >= 0; i--) {
  boxes[i].onclick = toggleCheckboxes;
}
// setup button listener to display map specified layers
document.getElementsByTagName("button")[0].onclick = displayLayer;

// setup click and hover listeners to display options panel
function displayOptions() {
  option.parentElement.classList.add("show");
  option.parentElement.setAttribute("aria-expanded", "true");
  option.nextElementSibling.setAttribute("aria-hidden", "false");
}
var option = document.getElementsByTagName("h1")[0];
// FIXME focus and click triggers each others
option.onclick = function (e) {
  if (option.parentElement.classList.contains("show")) {
    option.parentElement.classList.remove("show");
    option.parentElement.setAttribute("aria-expanded", "false");
    option.nextElementSibling.setAttribute("aria-hidden", "true");
  } else {
    displayOptions();
  }
}
option.onfocus = displayOptions;
// display options panel if screen is wide enough
if (window.innerWidth >= 730) displayOptions();


function toggleCheckboxes(e) {
  function every() {
    for (var i = boxes.length - 1; i > 0; i--) {
      if (!boxes[i].checked) return false;
    }
    return true;
  }
  function some() {
    for (var i = boxes.length - 1; i > 0; i--) {
      if (boxes[i].checked) return true;
    }
    return false;
  }

  var elem = e.target;
  if (elem.id === "all") {
    for(var i = boxes.length - 1; i > 0; i--) {
      boxes[i].checked = elem.checked;
    }
  } else {
    if (every()) {
      boxes[0].checked = true;
      boxes[0].indeterminate = false;
    } else if (some()) {
      boxes[0].indeterminate = true;
    } else {
      boxes[0].checked = false;
      boxes[0].indeterminate = false;
    }
  }
}

function displayLayer() {
  var all = boxes[0].checked;
  for(var i = boxes.length - 1; i >= 0; i--) {
    var id = boxes[i].id;
    if (id === "tram") {
      var visibility = all ? "visible" : boxes[i].checked ? "visible" : "none";
      if (map.getLayoutProperty(id, 'visibility') !== visibility) {
        map.setLayoutProperty(id, 'visibility', visibility);
      }
    }
  }
}

}
