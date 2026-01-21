const mongoose = require("mongoose");
const { Schema } = mongoose;
const mainDB = require("../db/db");
const spanEventSchema = new Schema(
  { 
    meta:{
      projectKey: { type: String, required: true, index: true },
      serviceName: { type: String, required: true, index: true },
    },
    info : { type: String, required:true, index: true},
    timestamp: { type: Date, required: true, index: true },                       
    span: { type: mongoose.Schema.Types.Mixed }
  },{ strict: false }
);

const rootSpanEventModel = mainDB.model(
  "rootSpanEvents",
  spanEventSchema,
  "rootSpanEvents"
);
module.exports = rootSpanEventModel;
