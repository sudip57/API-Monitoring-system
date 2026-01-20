const express = require("express");
const router = express.Router();
const resourceMetricsModel = require('../models/resourceMetricsModel');
let latest;
let timeSeries;
router.get("/",async(req,res)=>{
    if(!req.query.servicename){
        const latestPerService = await resourceMetricsModel.aggregate([
            {
                $match: {
                    "meta.projectKey": req.query.projectkey,
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group:{
                    _id:"$meta.serviceName",
                    latest:{ $first: "$$ROOT"}
                }
            },
            {
                $replaceRoot: { newRoot: "$latest" }
            }
        ])
            const from = new Date(Date.now() - 5 * 60 * 1000);
            const docs = await resourceMetricsModel.find({
                "meta.projectKey": req.query.projectkey,
                timestamp: { $gte: from }
                }).sort({ timestamp: 1 }).lean();
            timeSeries = docs;
            latest = latestPerService;
    }else{
            const doc = await resourceMetricsModel.findOne(
                {
                    "meta.projectKey": req.query.projectkey,
                    "meta.serviceName": req.query.servicename,
                },
                null,
                { sort: { timestamp: -1 } }
                ).lean();
            const from = new Date(Date.now() - 5 * 60 * 1000);
            const docs = await resourceMetricsModel.find({
                "meta.projectKey": req.query.projectkey,
                "meta.serviceName": req.query.servicename,
                timestamp: { $gte: from }
                }).sort({ timestamp: 1 }).lean();
            latest = doc;
            timeSeries = docs;
    }

    res.json({
            latest: latest,
            timeSeries: timeSeries
        });
})

module.exports = router;