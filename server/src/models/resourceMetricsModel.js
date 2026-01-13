const mongoose = require("mongoose");
const mainDB = require("../db/db");
const resourceMetricsSchema = new mongoose.Schema({
  projectKey: { type: String, required: true },
  serviceName: { type: String, required: true },
  timestamp: { type: Date, required: true },
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
  "ResourceMetrics",
  resourceMetricsSchema,
  "ResourceMetrics"
);
module.exports = resourceMetricsModel;