const axios = require("axios");
const ical = require("node-ical");

const seriesCalendars = [
  {
    series: "British GT",
    cal: "https://www.google.com/calendar/ical/6bh6kok6g3v97ogr2d1s2g1srs%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "Formula 1",
    cal: "https://calendar.google.com/calendar/ical/fa9bjl6tu13dd10b066stoo5do%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "Formula E",
    cal: "https://calendar.google.com/calendar/ical/vno0ntshopq0nmob26db2pcen8%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "SRO Intercontinental GT Challenge",
    cal: "https://calendar.google.com/calendar/ical/kcelko7ictk6okcf4peougahlo%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "SRO Fanatec GT World Challenge America",
    cal: "https://www.google.com/calendar/ical/1g47v5qu33g114060qa1ula9d0%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "NTT IndyCar Series",
    cal: "http://www.google.com/calendar/ical/hlskhf7l8ce7btind39bb9kf1o%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "Misc",
    cal: "https://www.google.com/calendar/ical/76fdr76289paph73v5tjt6mpis%40group.calendar.google.com/public/basic.ics",
  },
];

async function getEvents(calUrl, seriesName) {
  //parse ical contents from URL
  const calData = await axios.get(calUrl);
  const directEvents = ical.sync.parseICS(calData.data);
  let parsedEvents = [];
  Object.entries(directEvents).forEach(([key, value]) => {
    if (value.start > Date.now()) {
      parsedEvents.push({
        series: seriesName,
        summary: value.summary,
        start: value.start,
        end: value.end,
        location: value.location,
      });
    }
  });

  return parsedEvents;
}

export default async function handler(req, res) {
  let eventList = [];
  for (let i = 0; i < seriesCalendars.length; i++) {
    let events = await getEvents(
      seriesCalendars[i].cal,
      seriesCalendars[i].series
    );
    eventList = eventList.concat(events);
  }
  eventList.sort((a, b) => {
    return a.start - b.start;
  });
  res.status(200).json(eventList);
}
