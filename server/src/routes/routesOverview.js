const express = require("express");
const router = express.Router();
const requestEventModel = require('../models/requestEventModel')
const errorEventModel = require('../models/errorEventModel');
const { totalRequests, avgLatency } = require("../controllers/statsController");
router.get("/",async(req,res)=>{
    const from = new Date(req.timeRange.from);
    const to = new Date(req.timeRange.to);
    const {serviceName} = req.query;
    const [routeAgg,errorPerRoute] = await Promise.all([ 
        requestEventModel.aggregate([
            {
                $match: {
                "meta.projectKey":"test-project",
                "meta.serviceName":serviceName,
                "url": { $ne: null },
                "timestamp": { $gte: from, $lte: to }
                }
            },
            {
                $group: {
                _id: {
                    route: "$url",
                    method: "$method"
                },
                totalRequests: { $sum: 1 },
                avgLatency: { $avg: "$duration" },
                p95Latency: {
                    $percentile: {
                    input: "$duration",
                    p: [0.95],
                    method: "approximate"
                    }
                }
                }
            }
            ]),
            errorEventModel.aggregate([
                {
                $match: {
                projectKey:"test-project",
                serviceName,
                "url": { $ne: null },
                "timestamp": { $gte: from, $lte: to }
                }
            },{
                $group:{
                    _id: {
                        serviceName: "$serviceName",
                        route: "$url",
                        method: "$method",
                    }
                }
            }
            ,{
                $group:{
                    _id: {
                        route: "$_id.route",
                        method: "$_id.method"
                    },
                    errorCount: { $sum: 1 }
                }
            }
            ])
        ])
    console.log(routeAgg)
    console.log(errorPerRoute)
    const errorMap = Object.create(null)
    for(const e of errorPerRoute){
        const key = `${e._id.route}|${e._id.method}`;
        errorMap[key] = e.errorCount;

    }
    console.log(errorMap)
    const routeData = routeAgg.map(r =>{
        const key = `${r._id.route}|${r._id.method}`;
        const errorCount = errorMap[key] || 0;
        console.log(errorMap[key])
        console.log(r._id)
        console.log(errorCount)
        return {
            routeName : r._id,
            totalRequests : r.totalRequests,
            avgLatency : r.avgLatency.toFixed(2),
            p95Latency : r.p95Latency[0],
            errorCount : errorCount
        }
    })
    res.send({
        routeData
    })
})
module.exports = router