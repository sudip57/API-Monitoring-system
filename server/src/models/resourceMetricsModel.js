const mongoose = require("mongoose");
const mainDB = require("../db/db");
const resourceMetricsSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    meta:{
        projectKey: { type: String, required: true },
        serviceName: { type: String, required: true },
    },
    event: { type: mongoose.Schema.Types.Mixed }
},{ strict: false });
const resourceMetricsModel = mainDB.model(
  "resourceMetrics",
  resourceMetricsSchema,
  "resourceMetrics"
);
module.exports = resourceMetricsModel;