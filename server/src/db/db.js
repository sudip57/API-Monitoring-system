// server/src/db/db.js
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/apmDb";

// createConnection WITHOUT deprecated options
const mainDB = mongoose.createConnection(uri);

// event handlers
mainDB.on("error", (err) => console.error("MongoDB connection error:", err));
mainDB.on("connected", () => console.log("MongoDB connected (connected event)"));
mainDB.once("open", () => console.log("Connected DB:", mainDB.name)); 

module.exports =  mainDB;
