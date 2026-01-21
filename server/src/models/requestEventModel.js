// models/request.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const mainDB = require("../db/db");
const RequestEventSchema = new Schema(
  {   meta:{
        projectKey: { type: String, required: true, index: true },
        serviceName: { type: String, required: true, index: true },
      },
      timestamp: { type: Date, required: true, index: true },                       
      request: { type: mongoose.Schema.Types.Mixed }
    },{ strict: false }
);
const requestEventModel = mainDB.model("requestEvents", RequestEventSchema,"requestEvents");
module.exports = requestEventModel;