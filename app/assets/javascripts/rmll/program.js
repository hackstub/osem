function formatJson(json) {
  // FIXME modify api to serve well formated informations
  json = json.conferences[0];
  var data = {};
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  for (var i = 0; i < days.length; i++) {
    data[days[i]] = [];
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
          morning: [],
          afternoon: []
        };
      }

      if (date.getUTCHours() <= 12) {
        daypart = data[day][ev.track_id].morning;
      } else {
        daypart = data[day][ev.track_id].afternoon;
      }

      ev.date = date.getUTCHours() * 100 + date.getUTCMinutes();
      var daypartLen = daypart.length;
      if (daypartLen === 0) {
        daypart.push(ev);
      } else {
        for (var a = 0; a < daypartLen; a++) {
          if (daypart[a].date > ev.date) {
            daypart.splice(a - 1, 0, ev);
          }
        }
      }
    }
  }

  buildTable(data);
}

function buildTable(data) {
  var tbody = document.querySelector("tbody");
  var doc = document.createDocumentFragment();

  console.log(data);
  for (var i = 0; i < data.Saturday.length; i++) {
    if (data.Saturday[i]) {
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.innerHTML = data.Saturday[i].track.name;
      tr.appendChild(th);

      var morning = document.createElement("td");
      for (var j = 0; j < data.Saturday[i].morning.length; j++) {
        morning.appendChild(buildArticle(data.Saturday[i].morning[j]))
      }
      tr.appendChild(morning);

      var afternoon = document.createElement("td");
      for (var j = 0; j < data.Saturday[i].afternoon.length; j++) {
        afternoon.appendChild(buildArticle(data.Saturday[i].afternoon[j]))
      }
      tr.appendChild(afternoon);

      doc.appendChild(tr);
    }
  }
  tbody.appendChild(doc);
}

function buildArticle(ev) {
  var article = document.createElement("article");
  var title = document.createElement("h3");
  title.innerHTML = ev.title;
  var speaker = document.createElement("p");
  speaker.innerHTML = ev.speaker_names ;
  article.appendChild(title);
  article.appendChild(speaker);
  return article;
}

var baseUrl = "https://2018.rmll.info/api/v1/conferences/rmll2018/";
readJSONFile(baseUrl, formatJson);
