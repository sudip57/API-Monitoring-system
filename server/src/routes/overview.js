const express = require("express");
const router = express.Router();
const requestEventModel = require('../models/requestEventModel')
const errorEventModel = require('../models/errorEventModel')
function getServiceHealth({ errorRate, totalRequests }) {
  if (totalRequests < 50) {
    return {
      label: "No Data",
      className: "bg-zinc-800 text-zinc-400"
    }
  }

  if (errorRate < 0.1) {
    return {
      label: "Healthy",
      className: "bg-emerald-900/40 text-emerald-400"
    }
  }

  if (errorRate < 0.5) {
    return {
      label: "Degraded",
      className: "bg-yellow-900/40 text-yellow-400"
    }
  }

  if (errorRate < 1) {
    return {
      label: "Unhealthy",
      className: "bg-orange-900/40 text-orange-400"
    }
  }

  return {
    label: "Critical",
    className: "bg-red-900/40 text-red-400"
  }
}
router.get("/",async (req,res)=>{
  const from = new Date(req.timeRange.from);
  const to = new Date(req.timeRange.to);
  console.log('from ',from)
  console.log('to ',to)
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
  const distinctServiceCount = await requestEventModel.aggregate([
        {
          $match: {
            projectKey: "test-project",
            serviceName: { $ne: null },
            "timestamp": { $gte: from, $lte: to }
          }
        },
        {
          $group: { _id: "$serviceName" }
        },
        {
          $count: "count"
        }
      ]);
  const eRate  = ((totalErrors/totalRequests)*100).toFixed(2);
  const errorRate = eRate === "number"?eRate:0;
  const avgLatency =latencyResult.length>0 && typeof latencyResult[0].avgLatency === "number" ? latencyResult[0].avgLatency.toFixed(2):0;
  const p95Latency = latencyResult.length>0 &&typeof latencyResult[0].p95Latency[0]==="number"?latencyResult[0].p95Latency[0]:0;
  const avgThroughput = avgThroughputRPS.length>0 ? avgThroughputRPS[0].avgThroughputRPS.toFixed(2):0;
  const serviceCount = distinctServiceCount.length>0 ? distinctServiceCount[0].count : 0;
  res.send({
    totalRequests:totalRequests,
    errorRate:errorRate,
    avgLatency:avgLatency,
    p95Latency:p95Latency,
    avgThroughputRPS:avgThroughput,
    distinctServiceCount:serviceCount,
  })
})


module.exports = router