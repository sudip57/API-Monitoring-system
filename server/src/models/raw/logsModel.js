const mongoose = require("mongoose");
const { Schema } = mongoose;
const mainDB = require("../../db/db");
const logEventSchema = new Schema(
  { 
    meta:{
      projectKey: { type: String, required: true, index: true },
      serviceName: { type: String, required: true, index: true },
    },
    timestamp: { type: Date, required: true, index: true },                       
    event: { type: mongoose.Schema.Types.Mixed }
  },{ strict: false }
);

const logEventModel = mainDB.model(
  "logs",
  logEventSchema,
  "logs"
);
module.exports = logEventModel;