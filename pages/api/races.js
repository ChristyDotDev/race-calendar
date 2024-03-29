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
    series: "ABB FIA Formula E",
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
  {
    series: "FIA World Rallycross Championship",
    cal: "https://www.google.com/calendar/ical/l61t6l5vpoihhie0o6df4j5h20%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "Extreme E",
    cal: "https://calendar.google.com/calendar/ical/4th6rmpe52qpjvmfuq4p41vgvo%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "British Touring Car Championship",
    cal: "http://www.google.com/calendar/ical/9onbjrejbcstdm524hi0ush2t8%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "SRO Fanatec GT World Challenge Europe",
    cal: "http://www.google.com/calendar/ical/drne83rrmn7m9baje25qh2248s%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "SRO Fanatec GT World Challenge Asia",
    cal: "https://calendar.google.com/calendar/ical/plm3evhsd30l34r2tj68fh9mss%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "Super GT",
    cal: "http://www.google.com/calendar/ical/5ni9rjbofnkfvmpidmjpep9ek0%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "IMSA WeatherTech Sportscar",
    cal: "http://www.google.com/calendar/ical/njulhksvo83qeoruc3nhend9js%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "FIA World Endurance Championship",
    cal: "http://www.google.com/calendar/ical/61jccgg4rshh1temqk0dj4lens%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "Cup Series",
    cal: "http://www.google.com/calendar/ical/db8c47ne2bt9qbld2mhdabm0u8%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "Xfinity Series",
    cal: "http://www.google.com/calendar/ical/po54lfbfrvlkrrhirlame40a6c%40group.calendar.google.com/public/basic.ics",
  },
  {
    series: "FIA Formula 2",
    cal: "http://www.google.com/calendar/ical/rttoqh7u6m247f2ub6c05m4pe4%40group.calendar.google.com/public/basic.ics",
  }
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
  res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate=86400')
  res.status(200).json(eventList);
}
