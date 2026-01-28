const mongoose = require("mongoose");
const mainDB = require("../db/db");
const serviceMetricsSchema = new mongoose.Schema(
  {
    meta:{
      projectKey:{ type: String, required: true },
      serviceName: { type: String, required: true },
    },
    bucket: { type: Number, required: true }, 
    requestCount: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    avgLatency: { type: Number, default: 0 },
    p95Latency: { type: Number, default: 0 },
    p99Latency: { type: Number, default: 0 },
    rps: { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceMetricsSchema.index({ serviceName: 1, bucket: 1 });
const serviceMetricsModel = mainDB.model(
   "serviceMetrics",
  serviceMetricsSchema,
  "serviceMetrics"
)
module.exports = serviceMetricsModel;
