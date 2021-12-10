const express = require("express");
const path = require("path");
const cors = require("cors");

const WeatherDB = require("./modules/weather-service.js");
const db = new WeatherDB(
  "mongodb+srv://shox:Abdi12.@web422.srmb7.mongodb.net/sample_weatherdata?retryWrites=true&w=majority"
);

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.get("/api/weathers", (req, res) => {
  db.getAllWeathers(req.query.page, req.query.perPage)
    .then((data) => {
      res.status(201).json({
        weathers: data,
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/weather/:id", (req, res) => {
  db.getWeatherById(req.params.id)
    .then((data) => {
      res.json({ weather: data });
    })
    .catch((err) => {
      res.json(err);
    });
});

app.use((req, res) => {
  res.status(404).send("Resource not found");
});

db.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
