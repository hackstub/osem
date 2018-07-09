var baseUrl = "/api/v1/conferences/rmll2018/";
// var baseUrl = "https://osem.aius.u-strasbg.fr/api/v1/conferences/rmll2018";
var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
var today = days[new Date(Date.now()).getDay()];

// ╭─╮┌─╴╭╮╷┌─╴┌─╮╶┬╴╭─╴
// │╶╮├─╴│││├─╴├┬╯ │ │
// ╰─╯╰─╴╵╰╯╰─╴╵ ╰╶┴╴╰─╴

function formatJson(json, callbackBuilding, callbackSetup) {
  // FIXME modify api to serve well formated informations
  json = json[0];
  var data = {};
  var roomsName = ['ATRIUM - AT8', 'ATRIUM - AT9', 'ESCARPE - Amphi Ortscheidt', 'ESCARPE - Amphi 29', 'PLATANE - A08', 'PLATANE - A09', 'PLATANE - A10', 'PLATANE - A11', 'PLATANE - A12', 'PLATANE - A13', 'PLATANE - B01', 'PLATANE - B02', 'PLATANE - B03', 'PLATANE - B04', 'PLATANE - B05', 'Médiathèque Malraux', 'Shadok', "Jardins de l'université", "Presqu'île Malraux", 'Salle des colonnes']
  for (var i = 0; i < days.length; i++) {
    if (days[i] != "friday" && days[i] != "thursday") data[days[i]] = [];
  }

  // Apply trick to get translated name for tracks
  for (var i = 0; i < json.tracks.length; i++) {
    json.tracks[i].name = json.tracks[i].name.split("*")[lang];
  }

  var roomsLen = json.rooms.length;
  for (var i = 0; i < roomsLen; i++) {
    var room = json.rooms[i];
    var evLen = room.events.length;

    for (var j = 0; j < evLen; j++) {
      var ev = room.events[j];

      var date = new Date(ev.start_time);
      var day = days[date.getDay()];
      var daypart;

      if (data[day][ev.track_id] === undefined) {
        data[day][ev.track_id] = {
          track: json.tracks[ev.track_id - 1],
          events: []
        };
      }

      daypart = data[day][ev.track_id].events;
      ev.date = date.getUTCHours() * 100 + date.getUTCMinutes();
      var dateStr = ev.date + '';
      ev.day = lang === 0 ? day : date.toLocaleDateString("fr-FR", { weekday: 'long' });
      ev.dateStr = dateStr.substring(0, 2) + "h" + dateStr.substring(2);;
      ev.start = (date.getUTCHours() * 60 + date.getUTCMinutes()) - 10 * 60;
      ev.room = roomsName[i];
      var difficulty = json.difficulty_levels[ev.difficulty_level_id-1];
      ev.difficulty = difficulty ? difficulty.title.split("*")[0] : "null";
      ev.difficultyName = difficulty ? difficulty.title.split("*")[lang] : "null";

      var track = json.event_types.find(function (eventObj) {
        if (eventObj.id === ev.event_type_id) return eventObj;
      });
      ev.length = track.length;
      var type = track.title.split(" (")[0].split("*");
      ev.type = type[0];
      ev.typeName = type[lang];
      daypart.push(ev);
    }
  }

  // Reordered track list
  var newOrderId = Array(10, 7, 1, 8, 15, 11, 19, 20, 9, 14, 18, 17, 13, 12, 25, 16, 24, 21, 2, 3, 4, 5, 6, 22, 23);

  for (var day in data) {
    if (data.hasOwnProperty(day)) {
      var newOrderTracks = Array();
      for (var i = 0; i < data[day].length; i++) {
        if (data[day][i]) {
          data[day][i].events = data[day][i].events.sort(function(a,b) {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);} );
          for (var j = 0; j < data[day][i].events.length; j++) {
            var ev = data[day][i].events[j];
            if (j != 0 && data[day][i].events[j-1].date === ev.date) {
              data[day][i].events[j-1].class = "double-top";
              ev.class = "double-bottom";
            }
          }
          newOrderTracks[newOrderId.indexOf(i)] = data[day][i];
        }
      }
      callbackBuilding(newOrderTracks, day);
    }
  }
  if (callbackSetup) {
    callbackSetup();
  }
}

function initSelectorsListeners(eventCSSselector, sectionCSSselector) {
  function allHide(htmlColl) {
    for (var i = htmlColl.length - 1; i >= 0; i--) {
      if (!htmlColl[i].classList.contains("hide")) return false;
    }
    return true;
  }

  function hideEmptyTracks(tracks) {
    for (var i = tracks.length - 1; i >= 0; i--) {
      var evs = tracks[i].getElementsByClassName("event");
      if (allHide(evs)) {
        tracks[i].classList.add("hide");
      } else {
        tracks[i].classList.remove("hide");
      }
    }
  }

  var optionsDisplay = document.querySelectorAll("#selectors ul a");
  var isList = eventCSSselector != "table .event";
  for (var i = 0; i < optionsDisplay.length; i++) {
    optionsDisplay[i].addEventListener("click", function (e) {
      var events = document.querySelectorAll(eventCSSselector);
      var tracks = document.querySelectorAll(sectionCSSselector);
      var starred = document.getElementsByClassName("starred");
      if (isList) {
        var navDay = document.getElementsByClassName("day-nav");
      }


      var prop = e.target.id.split("-");

      if (prop[1] == "all") {
        // display everything
        for (var i = events.length - 1; i >= 0; i--) {
          events[i].classList.remove("hide");
          if (isList) {
            document.querySelector("a[href='#"+ events[i].id + "']").parentElement.classList.remove("hide");
          }
        }
        for (var i = tracks.length - 1; i >= 0; i--) {
          tracks[i].classList.remove("hide");
        }
        for (var i = starred.length - 1; i >= 0; i--) {
          starred[i].classList.remove("hide");
          if (isList) {
            navDay[i].classList.remove("hide");
          }
        }
      } else {
        for (var i = starred.length - 1; i >= 0; i--) {
          starred[i].classList.add("hide");
          if (isList) {
            navDay[i].classList.add("hide");
          }
        }
        // display only events that match the selector
        for (var i = events.length - 1; i >= 0; i--) {
          var isToShow = events[i].dataset[prop[0]] == prop[1];
          if (e.target.id == "type-other") {
            var other = ["debate", "chatroom", "arpentage littéraire"];
            isToShow = other.indexOf(events[i].dataset[prop[0]]) > -1;
          }

          if (isToShow) {
            events[i].classList.remove("hide");
            if (isList) {
              document.querySelector("a[href='#"+ events[i].id + "']").parentElement.classList.remove("hide");
            }
          } else {
            events[i].classList.add("hide");
            if (isList) {
              document.querySelector("a[href='#"+ events[i].id + "']").parentElement.classList.add("hide");
            }
          }
        }
        hideEmptyTracks(tracks);
      }

      var container = document.querySelector(".overflow");
      if (!isList) {
        container.scrollLeft = 0;
      }
      container.scrollTop = 0;
    });
  }
}


// ╶┬╴╭─┐┌─╮╷  ┌─╴
//  │ ├─┤│╶┤│  ├─╴
//  ╵ ╵ ╵└─╯╰─╴╰─╴

function buildTable(data, day) {
  var tbody = document.querySelector("table");
  var doc = domElem('tbody', '', {"data-day": day});;

  if (day != today) {
    doc.classList.add("hide");
  }

  for (var i = 0; i < data.length; i++) {
    if (data[i]) {
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.innerHTML = "<p>" + data[i].track.name + "</p>";
      tr.appendChild(th);

      var elems = document.createElement("td");
      for (var j = 0; j < data[i].events.length; j++) {
        var timeBetween = j === 0 ? data[i].events[j].start : data[i].events[j].start - (data[i].events[j-1].start + data[i].events[j-1].length)
        elems.appendChild(buildTableArticle(data[i].events[j], timeBetween))
      }
      tr.appendChild(elems);

      doc.appendChild(tr);
    }
  }
  tbody.appendChild(doc);
}

function setupTable() {
  initSelectorsListeners("table .event", "tbody tr");
  initTableListeners();
}

function buildTableArticle(ev, timeBetween) {
  var container = domElem('div', 'event-container');
  container.style.marginLeft = timeBetween * 5 + "px";
  container.style.width = ev.length * 5 + "px";

  var article = domElem('article', 'event', {
    "data-type": ev.type.toLowerCase(),
    "data-level": ev.difficulty.toLowerCase(),
  });
  if (ev.class) {
    container.classList.add(ev.class);
  }
  container.appendChild(article);

  var top = domElem('aside', 'top');
  var hour = domElem('mark');
  hour.innerHTML = ev.dateStr;
  var duration = domElem('span');
  duration.innerHTML = ev.length + "'";
  // var like = domElem('span');
  // like.innerHTML = "<3";
  appendChildren(top, [hour, duration]);
  article.appendChild(top);

  var middle = domElem('div', "content");
  var title = document.createElement("h3");
  title.innerHTML = ev.title;
  var subtitle = document.createElement('h4');
  subtitle.innerHTML = ev.subtitle;
  var speaker = domElem('p', 'author');
  speaker.innerHTML = ev.speaker_names;
  var abstract = domElem('div', 'abstract');
  abstract.innerHTML = ev.abstract_html;
  // var bio = domElem('div', 'bio');
  // bio.innerHTML = 'bio';
  appendChildren(middle, [title, subtitle, speaker, abstract]);
  article.appendChild(middle);

  var bottom = domElem('aside', 'bottom');
  var room = domElem('span', 'room');
  room.innerHTML = ev.room;
  var type = domElem('span');
  type.innerHTML = ev.typeName;
  var lvl = domElem('span', 'lvl');
  lvl.innerHTML = ev.difficultyName;

  var elements = [room, type, lvl];
  if (ev["require_registration"]) {
    var reg = domElem("a");
    reg.innerHTML = ["Registration required", "Inscription requise"][lang];
    reg.href = ev["registration_url"];
    elements.push(reg);
  }

  appendChildren(bottom, elements);
  article.appendChild(bottom);

  return container;
}

function initTableListeners () {
  // Day selection Listeners
  var daysbutton = document.querySelectorAll("#daySelection a");
  var starredDay = document.getElementsByClassName("starred-day");
  for (var i = 0; i < daysbutton.length; i++) {

    if (daysbutton[i].dataset.toggle === today) {
      daysbutton[i].classList.add("selected");
    }
    if (starredDay[i].dataset.day === today) {
      starredDay[i].classList.remove("hide");
    }
    daysbutton[i].addEventListener("click", function (e) {
      var day = e.target.nodeName == "SPAN" ? e.target.parentElement.dataset.toggle : e.target.dataset.toggle;
      var overflowed = document.querySelector(".overflow");
      overflowed.scrollTop = 0;
      overflowed.scrollLeft = 0;
      document.querySelector("tbody:not(.hide)").classList.add("hide");
      document.querySelector(".starred-day:not(.hide)").classList.add("hide");
      document.querySelector("tbody[data-day='" + day + "']").classList.remove("hide");
      document.querySelector(".starred-day[data-day='" + day + "']").classList.remove("hide");

      document.querySelector(".selected").classList.remove("selected");
      e.target.classList.add("selected")

    });
  }

  function findArticle (el, type) {
    while ((el = el.parentElement) && el.nodeName != type);
    return el;
  }

  // event onclick card display
  var events = document.querySelectorAll("table .event");
  for (var i = 0; i < events.length; i++) {
    events[i].addEventListener("mousedown", function (e) {
      function toggleCard () {
        article.removeEventListener("mouseup", toggleCard);
        if (!isCard && Date.now() - counter > 250) {
          return;
        }
        if (isCard) {
          document.getElementById("bg-card").style.display = "none";
          article.classList.remove("card");
          article.parentElement.classList.remove("card");
          document.querySelector(".overflow").classList.add("dragscroll");
          dragscroll.reset();
        } else {
          document.getElementById("bg-card").style.display = "block";
          article.classList.add("card");
          article.parentElement.classList.add("card");
          document.querySelector(".overflow").classList.remove("dragscroll");
          dragscroll.reset();
        }
      }
      var article = e.target.nodeName == 'ARTICLE' ? e.target : findArticle(e.target, 'ARTICLE');
      var isCard = article.classList.contains("card");
      var counter = Date.now();
      article.addEventListener("mouseup", toggleCard);
    });
  }

  // Grey card zone listeners
  document.getElementById('bg-card').onclick = function (e) {
    document.getElementById('bg-card').style.display = "none";
    document.querySelector('.event.card').classList.remove("card");
    document.querySelector('.event-container.card').classList.remove("card");
    document.querySelector('.overflow').classList.add("dragscroll");
    dragscroll.reset();
  }
}


// ╷  ╶┬╴╭─╴╶┬╴
// │   │ ╰─╮ │
// ╰─╴╶┴╴╶─╯ ╵

function buildList(data, day) {
  // FIXME change it directly in formatJson()
  data = data.filter(function(track) { return track != undefined });
  var tracks = data.map(function(track) { return { name: track.track.name, id: day + "-track" + track.track.id, events: track.events } });

  var dayDom = document.querySelector("[data-day=" + day + "]")
  dayDom.querySelector(".pres nav").appendChild(buildNavList(tracks));

  var agenda = document.createDocumentFragment();
  for (var i = 0; i < tracks.length; i++) {
    agenda.appendChild(buildTrackSection(tracks[i]));
  }
  dayDom.querySelector(".agenda").appendChild(agenda);
}

function setupList() {
  document.querySelector("section.days").classList.remove("hide");
  var url = window.location.href;
  if (url.indexOf('#') > -1) {
    var id = url.substring(url.lastIndexOf('#') + 1);
    document.getElementById(id).scrollIntoView();
  } else {
    document.getElementById(today).scrollIntoView();
  }
  initSelectorsListeners(".track .event", ".track");
}

function buildNavList(links, day) {
  var ul = domElement("ul", {class: "right"});
  var ulTitle = domElement("h4");
  ulTitle.innerHTML = "Tracks";
  ul.appendChild(ulTitle);

  for (var i = 0; i < links.length; i++) {
    var li = document.createElement("li");
    var a = domElement("a", {href: "#" + links[i].id});
    a.innerHTML = links[i].name;
    li.appendChild(a);
    ul.appendChild(li);
  }
  return ul;
}

function buildTrackSection(track) {
  var section = domElement("section", {class: "track", id: track.id});
  var trackPres = domElement("article", {class: "pres"});
  section.appendChild(trackPres);

  var title = domElement("h4");
  title.innerHTML = track.name;
  var nav = domElement("nav");
  appendChildren(trackPres, [title, nav]);

  var ul = domElement("ul");
  nav.appendChild(ul);
  var ulTitle = domElement("h4");
  ulTitle.innerHTML = ["Events", "Événements"][lang];
  ul.appendChild(ulTitle);

  var events = track.events;
  for (var i = 0; i < events.length; i++) {
    events[i].id = track.id + "-" + i;
    var li = document.createElement("li");
    var a = domElement("a", {href: "#" + events[i].id});
    a.innerHTML = events[i].title;
    li.appendChild(a);
    ul.appendChild(li);

    section.appendChild(buildListArticle(track.events[i]));
  }

  return section;
}

function buildListArticle(ev) {
  var article = domElement("article", {
    class: "event",
    id: ev.id,
    "data-type": ev.type.toLowerCase(),
    "data-level": ev.difficulty.toLowerCase(),
  });

  var title = document.createElement("h5");
  title.innerHTML = ev.title;
  article.appendChild(title);
  if (ev.subtitle && ev.subtitle != "") {
    var subtitle = document.createElement("h6");
    subtitle.innerHTML = ev.subtitle;
    article.appendChild(subtitle);
  }

  var content = domElement("div", {class: "content"});
  var speakers = domElement("p");
  speakers.innerHTML = ev.speaker_names;
  var abstract = domElement("div", {class: "abstract"});
  abstract.innerHTML = ev.abstract_html;
  appendChildren(content, [speakers, abstract]);

  var infosKeys = [
    ["Hour", "Type", "Building", "Duration", "Difficulty", "Day"],
    ["Heure", "Type", "Batiment", "Durée", "Niveau", "Jour"]
  ];
  var infosValues = [ev.dateStr.replace("h", ":"), ev.typeName, ev.room, ev.length + "'", ev.difficultyName, ev.day];
  var infos = domElement("dl", {class: "infos"});
  for (var i = 0; i < infosValues.length; i++) {
    var container = document.createElement("div");
    var desc = document.createElement("dt");
    if (i == 0) {
      var hour = document.createElement("time");
      hour.innerHTML = infosKeys[lang][i];
      desc.appendChild(hour);
    } else {
      desc.innerHTML = infosKeys[lang][i];
    }
    var val = document.createElement("dd");
    val.innerHTML = infosValues[i];
    appendChildren(container, [desc, val])
    infos.appendChild(container);
  }

  if (ev["require_registration"]) {
    var reg = domElem("a");
    reg.innerHTML = ["Register here", "S'inscrire"][lang];
    reg.href = ev["registration_url"];
    infos.appendChild(reg);
  }

  appendChildren(article, [content, infos]);

  return article;
}
