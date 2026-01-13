const express = require("express");
const router = express.Router();
const resourceMetricsModel = require('../models/resourceMetricsModel');
router.get("/",async(req,res)=>{
    const doc = await resourceMetricsModel.findOne(
        {
            "meta.projectKey": "test-project",
            "meta.serviceName": "service-a"
        },
        null,
        { sort: { timestamp: -1 } }
        ).lean();
    const from = new Date(Date.now() - 5 * 60 * 1000);
    const docs = await resourceMetricsModel.find({
    "meta.projectKey": "test-project",
    "meta.serviceName": "service-a",
    timestamp: { $gte: from }
    }).sort({ timestamp: 1 }).lean();
    res.json({
        latest: doc,
        timeSeries: docs
    });
})

module.exports = router;