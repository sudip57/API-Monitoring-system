// models/error.model.js
const mongoose = require("mongoose");
const mainDB = require("../db/db");
const { Schema } = mongoose;

const ErrorEventSchema = new Schema(
  {
      projectKey: { type: String, required: true, index: true },
      serviceName: { type: String, required: true, index: true },
      timestamp: { type: Date, required: true, index: true },                       
      error: { type: mongoose.Schema.Types.Mixed }
    },{ strict: false }
);
const errorEventModel = mainDB.model("errorEvents",ErrorEventSchema,"errorEvents");
module.exports = errorEventModel;
