const mongoose = require("mongoose");
const { Schema } = mongoose;
const mainDB = require("../../db/db");
const spanEventSchema = new Schema(
  { 
    info : { type: String, required:true, index: true},
    meta:{
      projectKey: { type: String, required: true, index: true },
      serviceName: { type: String, required: true, index: true },
    },
    timestamp: { type: Date, required: true, index: true },                       
    event: { type: mongoose.Schema.Types.Mixed }
  },{ strict: false }
);

const childSpanEventModel = mainDB.model(
  "childSpanEvents",
  spanEventSchema,
  "childSpanEvents"
);
module.exports = childSpanEventModel;