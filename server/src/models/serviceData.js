const mongoose = require("mongoose");
const mainDB = require("../db/db");
const serviceDataSchema =  new mongoose.Schema({
    projectKey:String,
    serviceName: String,
    timestamp: Date,
    requestCount: Number,
    errorCount: Number,
    totalDuration: Number,
    p95Latency:Number,
});
serviceDataSchema.index({ serviceName: 1, timestamp: 1 ,projectKey:1 });
const serviceDataModel = mainDB.model(
  "serviceData",
serviceDataSchema,
  "serviceData"
);
module.exports = serviceDataModel;
