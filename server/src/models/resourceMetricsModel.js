const mongoose = require("mongoose");
const mainDB = require("../db/db");
const resourceMetricsSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    meta:{
        projectKey: { type: String, required: true },
        serviceName: { type: String, required: true },
    },
    metrics: {
    cpu: {
      percent: { type: Number, required: true }
    },
    memory: {
      rssMB: { type: Number, required: true },
      heapUsedMB: { type: Number, required: true }
    },
    systemMemory: {
      totalMB: { type: Number, required: true },
      freeMB: { type: Number, required: true }
    },
    uptimeSec:{type:Number},
    network:{
      inMB:{type:Number},
      outMB:{type:Number}
    }
  }
});
const resourceMetricsModel = mainDB.model(
  "resourceMetrics",
  resourceMetricsSchema,
  "resourceMetrics"
);
module.exports = resourceMetricsModel;