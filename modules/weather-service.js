const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weatherSchema = new Schema({
  st: String,
  ts: Date,
  position: {
    point: String,
    coordinates: [Number],
  },
  elevation: Number,
  callLetters: String,
  qualityControl: String,
  dataSource: String,
  type: String,
  airTemperature: {
    value: Number,
    quality: String,
  },
  dewPoint: {
    value: Number,
    quality: String,
  },
  pressure: {
    value: Number,
    quality: String,
  },
  wind: {
    direction: {
      angle: Number,
      quality: String,
    },
    type: String,
    speed: {
      rate: Number,
      quality: String,
    },
  },
  visibility: {
    distance: {
      value: Number,
      quality: String,
    },
    variability: {
      value: String,
      quality: String,
    },
  },
  skyCondition: {
    ceilingHeight: {
      value: Number,
      quality: String,
      determination: Number,
    },
    cavok: String,
  },
  sections: [String],
  precipitationEstimatedObservations: {
    discrepancy: String,
    estimatedWaterDepth: Number,
  },
  pastWeatherObservationManual: [
    {
      atmosphericCondition: {
        condition: String,
        quality: String,
      },
      period: {
        value: Number,
        quality: String,
      },
    },
  ],
  skyConditionObservation: {
    totalCoverage: {
      value: String,
      opaque: String,
      quality: String,
    },
    lowestCloudCoverage: {
      value: String,
      quality: String,
    },
    lowCloudGenus: {
      value: String,
      quality: String,
    },
    lowestCloudBaseHeight: {
      value: Number,
      quality: String,
    },
    midCloudGenus: {
      value: String,
      quality: String,
    },
    hightCloudGenus: {
      value: String,
      quality: String,
    },
  },
  presentWeatherObservationManual: [
    {
      condition: String,
      quality: String,
    },
  ],
  waveMeasurement: {
    method: String,
    waves: {
      period: Number,
      height: Number,
      quality: String,
    },
    seaState: {
      code: String,
      quality: String,
    },
  },
});

module.exports = class WeatherDB {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.Weather = null;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(this.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      db.on("error", () => {
        reject();
      });

      db.once("open", () => {
        this.Weather = db.model("datas", weatherSchema, "data");
        resolve();
      });
    });
  }

  getAllWeathers(page, perPage) {
    if (+page && +perPage) {
      return this.Weather.find({})
        .sort(this.Weather._id)
        .limit(+perPage)
        .exec();
    }
    return Promise.reject(
      new Error("Page and perPage query parameters must be present")
    );
  }

  getWeatherById(id) {
    return this.Weather.findOne({ _id: id }).exec();
  }
};
