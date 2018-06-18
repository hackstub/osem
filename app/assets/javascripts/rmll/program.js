function formatJson(json) {
  // FIXME modify api to serve well formated informations
  json = json[0];
  var data = {};
  var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  var roomsName = ['ATRIUM - AT8', 'ATRIUM - AT9', 'ESCARPE - Amphi Ortscheidt', 'ESCARPE - Amphi 29', 'PLATANE - A08', 'PLATANE - A09', 'PLATANE - A10', 'PLATANE - A11', 'PLATANE - A12', 'PLATANE - A13', 'PLATANE - B01', 'PLATANE - B02', 'PLATANE - B03', 'PLATANE - B04', 'PLATANE - B05', 'Médiathèque Malraux', 'Shadok', "Jardins de l'université", "Presqu'île Malraux", 'Salle des colonnes']
  for (var i = 0; i < days.length; i++) {
    if (days[i] != "friday") data[days[i]] = [];
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
      ev.dateStr = dateStr.substring(0, 2) + "h" + dateStr.substring(2);;
      ev.start = (date.getUTCHours() * 60 + date.getUTCMinutes()) - 10 * 60;
      ev.room = roomsName[room.id]
      var difficulty = json.difficulty_levels[ev.difficulty_level_id-1];
      ev.difficulty = difficulty ? difficulty.title : "null";
      var track = json.event_types.find(function (eventObj) {
        if (eventObj.id === ev.event_type_id) return eventObj;
      });
      ev.length = track.length;
      ev.type = track.title.split(" ")[0];
      daypart.push(ev);
    }
  }

  for (var day in data) {
    if (data.hasOwnProperty(day)) {
      for (var i = data[day].length - 1; i >= 0; i--) {
        if (data[day][i]) {
          data[day][i].events = data[day][i].events.sort(function(a,b) {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);} );
        }
      }
      buildTable(data[day], day);
    }
  }
}

function buildTable(data, day) {
  var tbody = document.querySelector("table");
  var doc = domElem('tbody', '', {"data-day": day});;

  // doc.id = day;
  if (day != "saturday") {
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
        elems.appendChild(buildArticle(data[i].events[j], timeBetween))
      }
      tr.appendChild(elems);

      doc.appendChild(tr);
    }
  }
  tbody.appendChild(doc);

  var events = document.querySelectorAll("table .event");
  for (var i = 0; i < events.length; i++) {
    function findArticle (el, type) {
      while ((el = el.parentElement) && el.nodeName != type);
      return el;
    }

    events[i].addEventListener("mousedown", function (e) {
      function toggleCard () {
        article.removeEventListener("mouseup", toggleCard);
        if (!isCard && Date.now() - counter > 250) {
          return
        }
        if (isCard) {
          document.getElementById("bg-card").style.display = "none";
          article.classList.remove("card");
        } else {
          document.getElementById("bg-card").style.display = "block";
          article.classList.add("card");
        }
      }
      var article = e.target.nodeName == 'ARTICLE' ? e.target : findArticle(e.target, 'ARTICLE');
      var isCard = article.classList.contains("card");
      var counter = Date.now();
      article.addEventListener("mouseup", toggleCard);
    });
  }
}

function buildArticle(ev, timeBetween) {
  var container = domElem('div', 'event-container');
  container.style.marginLeft = timeBetween * 5 + "px";
  container.style.width = ev.length * 5 + "px";

  var article = domElem('article', 'event', {"data-type": ev.type.toLowerCase()});
  container.appendChild(article);

  var top = domElem('aside', 'top');
  var hour = domElem('mark');
  hour.innerHTML = ev.dateStr;
  var duration = domElem('span');
  duration.innerHTML = ev.length + "'";
  var like = domElem('span');
  like.innerHTML = "<3";
  appendChildren(top, [hour, duration, like]);
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
  var bio = domElem('div', 'bio');
  bio.innerHTML = 'bio';
  appendChildren(middle, [title, subtitle, speaker, abstract, bio]);
  article.appendChild(middle);

  var bottom = domElem('aside', 'bottom');
  var room = domElem('span', 'room');
  room.innerHTML = ev.room;
  var type = domElem('span');
  type.innerHTML = ev.type;
  var lvl = domElem('span', 'lvl');
  lvl.innerHTML = ev.difficulty;
  appendChildren(bottom, [room, type, lvl]);
  article.appendChild(bottom);

  return container;
}

var baseUrl = "/api/v1/conferences/rmll2018/";
// var baseUrl = "https://osem.aius.u-strasbg.fr/api/v1/conferences/rmll2018";
readJSONFile(baseUrl, formatJson);

var daysbutton = document.querySelectorAll(".sheets a");
for (var i = 0; i < daysbutton.length; i++) {
  daysbutton[i].addEventListener("click", function (e) {
    var day = e.target.dataset.toggle;
    document.querySelector("tbody:not(.hide)").classList.add("hide");
    document.querySelector(".starred-day:not(.hide)").classList.add("hide");
    document.querySelector("tbody[data-day='" + day + "']").classList.remove("hide");
    document.querySelector(".starred-day[data-day='" + day + "']").classList.remove("hide");

  });
}

document.getElementById('bg-card').onclick = function (e) {
  document.getElementById('bg-card').style.display = "none";
  document.querySelector('.card').classList.remove("card");
}
