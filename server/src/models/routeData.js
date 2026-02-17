const mongoose = require("mongoose");
const mainDB = require("../db/db");
const routeDataSchema =  new mongoose.Schema({
    projectKey: String,
    serviceName: String,
    route: String,
    method: String,
    timestamp: Date,
    requestCount: Number,
    errorCount: Number,
    totalDuration: Number,
    p95Latency:Number,
    statusCount:Object,
});
routeDataSchema.index({ serviceName: 1, timestamp: 1 ,projectKey:1 });
const routeDataModel = mainDB.model(
  "routeData",routeDataSchema,
  "routeData"
);
module.exports = routeDataModel;
