const express = require("express");

const headers = {
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'text/event-stream;charset=UTF-8',
  'Connection': 'keep-alive'
};

const app = express();

app.get("/notifications/LOCATIONS/subscribe", function(req, res) {
  console.log('ORIGIN: ', req.headers.origin);
  console.log('REQUEST URL: ', req.url);
  console.log('REQUEST METHOD: ', req.method);

  res.writeHead(res.statusCode, headers);

  let event = "event: notify";
  let data = `data: ${JSON.stringify({
    id: 2,
    title: "TEST",
    text: "Messaggio di test, messaggio di test, messaggio di test, messaggio di test, messaggio di test, messaggio di test, messaggio di test, messaggio di test.",
    unread: true,
    creationTime: "2018-09-25T15:23:48",
    priority: 0,
    application: "ALL",
    validFrom: "2018-09-25T15:23:48",
    validTo: "2018-09-25T17:23:48",
    type: "BROADCAST"
  })}`;

  console.log("RESPONSE:", `${event}\n${data}\n\n`);

  res.end(`${event}\n${data}\n\n`);
});

app.listen(3000, () => console.log("SSE app listening on port 3000!"));
