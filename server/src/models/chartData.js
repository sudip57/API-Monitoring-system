const mongoose = require("mongoose");
const mainDB = require("../db/db");
const chartDataSchema =  new mongoose.Schema({
    projectKey:String,
    timestamp: Date,
    totalRequests: Number,
    totalErrors: Number,
    avgLatency:Number,
    errorRate:Number,
    avgThroughput:Number,
    p95Latency:Number,
});
chartDataSchema.index({
  projectKey: 1,
  timestamp: 1,
  type:1,
});

const chartDataModel = mainDB.model(
  "chartData",
chartDataSchema,
  "chartData"
);
module.exports = chartDataModel;