const express = require("express");
const router = express.Router();
const { saveEvents} = require("../controllers");
router.post("/", (req, res) => {
    const io = req.app.get("io");
    // console.log("Received ingest request:", req.body);
    saveEvents(req.body,io);  
});
router.get("/", (req, res) => {
    res.json(getRequests());
});
module.exports = router;