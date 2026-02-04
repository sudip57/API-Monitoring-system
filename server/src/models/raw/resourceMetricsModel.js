const mongoose = require("mongoose");
const mainDB = require("../../db/db");
const resourceMetricsSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    meta:{
        projectKey: { type: String, required: true },
        serviceName: { type: String, required: true },
    },
    event: { type: mongoose.Schema.Types.Mixed }
},{ strict: false });
resourceMetricsSchema.index({  "meta.projectKey": 1,
  "meta.serviceName": 1,
  timestamp: -1});
const resourceMetricsModel = mainDB.model(
  "resourceMetrics",
  resourceMetricsSchema,
  "resourceMetrics"
);
module.exports = resourceMetricsModel;