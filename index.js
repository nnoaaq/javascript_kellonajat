require("dotenv").config();
const { google } = require("googleapis");
const express = require("express");
const app = express();
const authClient = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);
app.get("/", (req, res) => {
  const authUrl = authClient.generateAuthUrl({
    scope: "https://www.googleapis.com/auth/calendar",
  });
  res.send(`<a href="${authUrl}">${authUrl}</a>`);
});
app.get("/auth/google-success", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await authClient.getToken(code);
  authClient.setCredentials(tokens);
  const calendar = google.calendar({
    version: "v3",
    auth: authClient,
  });
  const calendarEvent = {
    summary: "TESTI_testi",
    end: {
      dateTime: "2026-07-07T08:52:00",
      timeZone: "Europe/Helsinki",
    },
    start: {
      dateTime: "2026-07-07T07:52:00",
      timeZone: "Europe/Helsinki",
    },
  };
  const calendarRes = await calendar.events.insert({
    calendarId:
      "9ddc083054c8f9a7d04a14e5520c3d8dda0e78200034f77860067dc4247369d2@group.calendar.google.com",
    requestBody: calendarEvent,
  });
  res.send(calendarRes);
});
app.listen(3000, () => {
  console.log("Palvelin käynnissä osoitteessa http://localhost:3000");
});
