const express = require("express");
const router = express.Router();
const resourceMetricsModel = require('../models/resourceMetricsModel');
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
        const combined = latestPerService.reduce(
            (acc, doc) => {
                acc.cpu.percent += doc.metrics.cpu.percent || 0;
                acc.memory.rssMB += doc.metrics.memory.rssMB || 0;
                acc.memory.heapUsedMB += doc.metrics.memory.heapUsedMB || 0;
                acc.network.inMB += doc.metrics.network.inMB || 0;
                acc.network.outMB += doc.metrics.network.outMB || 0;
                acc.services += 1;
                if (!acc.systemMemory && doc.metrics.systemMemory) {
                acc.systemMemory = doc.metrics.systemMemory;
                }
                return acc;
            },
            {
                cpu: { percent: 0 },
                memory: { rssMB: 0, heapUsedMB: 0 },
                network: { inMB: 0, outMB: 0 },
                systemMemory: null,
                services: 0
            }
            );
        res.json({
            latest: combined, // array → one per service
        });
        return;
    }
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
            res.json({
                latest: doc,
                timeSeries: docs
            });
})

module.exports = router;