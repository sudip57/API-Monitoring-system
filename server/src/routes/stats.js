const express = require("express");
const router = express.Router();
const getStats = require("../controllers/statsController")

router.get("/",async (req,res)=>{
    const from = new Date(req.timeRange.from);
    const to = new Date(req.timeRange.to);
    const data = await getStats(from,to);
    res.send(data);
})

module.exports = router