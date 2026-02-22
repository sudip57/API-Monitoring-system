const mongoose = require("mongoose");
const mainDB = require("../db/db");
const chartDataSchema =  new mongoose.Schema({
    projectKey:String,
    route:String,
    serviceName:String,
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
  route:1,
serviceName:1,
});

const routeChartDataModel = mainDB.model(
  "routeChartData",
    chartDataSchema,
  "routeChartData"
);
module.exports = routeChartDataModel;