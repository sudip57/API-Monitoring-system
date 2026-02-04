const express = require("express");
const router = express.Router();
const { saveEvents} = require("../controllers/store");
router.post("/", (req, res) => {
    console.log("Received ingest request:", req.body);
    saveEvents(req.body);  
});
router.get("/", (req, res) => {
    res.json(getRequests());
});
module.exports = router;