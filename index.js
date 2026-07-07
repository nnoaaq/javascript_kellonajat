require("dotenv").config();
const { google } = require("googleapis");
const express = require("express");
const app = express();
const authClient = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);
function time(year, month, day, hour, minute) {
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;
}
app.get("/", (req, res) => {
  const authUrl = authClient.generateAuthUrl({
    scope: "https://www.googleapis.com/auth/calendar",
  });
  console.log(time(2026, 7, 7, 9, 0));
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
  const [year, month, day, hour, minute] = [2026, 7 - 1, 7, 9, 0];
  const dateObj = new Date(year, month, day, hour, minute);
  const calendarEvent = {
    summary: "TESTI_testi",
    end: {
      dateTime: time(2026, 7, 7, 9, 0),
      timeZone: "Europe/Helsinki",
    },
    start: {
      dateTime: time(2026, 7, 7, 8, 0),
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
