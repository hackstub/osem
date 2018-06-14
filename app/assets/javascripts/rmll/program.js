function formatJson(json) {
  // FIXME modify api to serve well formated informations
  json = json.conferences[0];
  var data = {};
  var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
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
      buildTable(data[day], day);
    }
  }

}

function buildTable(data, day) {
  var tbody = document.querySelector("table");
  var doc = document.createElement("tbody");
  doc.id = day;
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
      data[i].events.sort(function(a,b) {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);} );
      for (var j = 0; j < data[i].events.length; j++) {
        var timeBetween = j === 0 ? data[i].events[j].date - 1000 : data[i].events[j].date - (data[i].events[j-1].date + data[i].events[j-1].length)
        elems.appendChild(buildArticle(data[i].events[j], timeBetween))
      }
      tr.appendChild(elems);


      doc.appendChild(tr);
    }
  }
  tbody.appendChild(doc);
}

function buildArticle(ev, timeBetween) {
  var container = document.createElement("div");
  container.classList.add('event');
  var article = document.createElement("article");

  var title = document.createElement("h3");
  title.innerHTML = ev.title;
  var speaker = document.createElement("p");

  speaker.innerHTML = ev.speaker_names ;
  var extra = document.createElement('aside');
  var hour = document.createElement("span");
  var type = document.createElement("span");
  var time = '' + ev.date;
  hour.innerHTML = time[0] + time[1] + "h" + time[2] + time[3];
  type.innerHTML = ev.type;
  extra.appendChild(hour);
  extra.appendChild(type);
  container.style.width = ev.length * 0.375 + "rem";
  container.style.marginLeft = timeBetween * 0.375 + "rem";

  article.appendChild(extra);
  article.appendChild(title);
  article.appendChild(speaker);
  article.setAttribute("data-type", ev.event_type_id);
  container.appendChild(article)
  // console.log(ev.type);

  // var like = document.createElement("span");
  // like.textContent = "<3";
  // article.appendChild(like);

  return container;
}

var baseUrl = "https://2018.rmll.info/api/v1/conferences/rmll2018/";
readJSONFile(baseUrl, formatJson);

var daysbutton = document.querySelectorAll(".sheets a");
for (var i = 0; i < daysbutton.length; i++) {
  daysbutton[i].addEventListener("click", function (e) {
    document.querySelector("tbody:not(.hide)").classList.add("hide");
    document.getElementById(e.target.dataset.toggle).classList.remove("hide");
  });
}

var events = document.getElementsByTagName("article")
