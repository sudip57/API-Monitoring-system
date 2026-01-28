const express = require("express");
const router = express.Router();
const requestEventModel = require('../models/requestEventModel')
const errorEventModel = require('../models/errorEventModel')
router.get("/",async (req,res)=>{
  const from = new Date(req.timeRange.from);
  const to = new Date(req.timeRange.to);
  const [totalRequests, totalErrors, latencyResult,avgThroughputRPS]= await Promise.all([
      requestEventModel.countDocuments({
        "meta.projectKey": "test-project",
        "timestamp": { $gte: from, $lte: to }
      }),

      errorEventModel.countDocuments({
        "meta.projectKey": "test-project",
        "timestamp": { $gte: from, $lte: to }
      }),

      requestEventModel.aggregate([
        {
          $match:{
            "timestamp":{$gte:from , $lte:to},
            "duration": { $type: "number" }
        }
        },
        {
          $group:{
            _id:null,
            avgLatency:{$avg:"$duration"},
            p95Latency:{
              $percentile:{
                input:"$duration",
                p:[0.95],
                method: "approximate"
              }
            }
          }
        },
      ]),
      requestEventModel.aggregate([
          {
              $match: {
                "timestamp": { $gte: from, $lte: to }
              }
            },
            {
              $group: {
                _id: {
                  $dateTrunc: {
                    date: "$timestamp",
                    unit: "second"
                  }
                },
                count: { $sum: 1 }
              }
            },
            {
              $group: {
                _id: null,
                avgThroughputRPS: { $avg: "$count" }
              }
            }
        ])
    ]);
  const eRate  = ((totalErrors/totalRequests)*100).toFixed(2);
  const errorRate = eRate === "number"?eRate:0;
  const avgLatency =latencyResult.length>0 && typeof latencyResult[0].avgLatency === "number" ? latencyResult[0].avgLatency.toFixed(2):0;
  const p95Latency = latencyResult.length>0 &&typeof latencyResult[0].p95Latency[0]==="number"?latencyResult[0].p95Latency[0]:0;
  const avgThroughput = avgThroughputRPS.length>0 ? avgThroughputRPS[0].avgThroughputRPS.toFixed(2):0;
  res.send({
    totalRequests:totalRequests,
    errorRate:errorRate,
    avgLatency:avgLatency,
    p95Latency:p95Latency,
    avgThroughputRPS:avgThroughput,
  })
})


module.exports = router