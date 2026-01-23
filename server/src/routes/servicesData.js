const express = require("express");
const router = express.Router();
const requestEventModel = require('../models/requestEventModel')
const errorEventModel = require('../models/errorEventModel');
function getServiceHealth({ errorRate, totalRequests }) {
  if (totalRequests < 50) {
    return {
      label: "No Data",
    }
  }

  if (errorRate < 0.1) {
    return {
      label: "Healthy",
    }
  }

  if (errorRate < 0.5) {
    return {
      label: "Degraded",
    }
  }

  if (errorRate < 1) {
    return {
      label: "Unhealthy",
    }
  }

  return {
    label: "Critical",
  }
}
router.get("/",async(req,res)=>{
    const from = new Date(req.timeRange.from);
    const to = new Date(req.timeRange.to);

    const [reqPerService,errorPerService,throughputPerService] = await Promise.all([
        requestEventModel.aggregate([
            {$match:{
                "meta.projectKey":"test-project",
                "request.timestamp":{$gte:from,$lte:to}
            }},{
                $group:{
                    _id:"$meta.serviceName",
                    totalRequests:{$sum:1},
                    avgLatency:{$avg:"$request.duration"},
                    p95Latency:{
                    $percentile:{
                        input:"$request.duration",
                        p:[0.95],
                        method: "approximate"
                    }
                    }
                }
            }
            
        ]),
        errorEventModel.aggregate([
            {$match:{
                "meta.projectKey":"test-project",
                "error.timestamp":{$gte:from,$lte:to}
            }},{
                $group:{
                    _id:"$meta.serviceName",
                    errorCount:{$sum:1}
                }
            }
        ]),
        requestEventModel.aggregate([
                {
                    $match: {
                    "meta.projectKey": "test-project",
                    "request.timestamp": { $gte: from, $lte: to }
                    }
                },
                {
                    $group: {
                    _id: {
                        serviceName: "$meta.serviceName",
                        second: {
                        $dateTrunc: {
                            date: "$request.timestamp",
                            unit: "second"
                        }
                        }
                    },
                    count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                    _id: "$_id.serviceName",
                    avgThroughputRPS: { $avg: "$count" }
                    }
                }
                ])
    ])
    const errorMap = Object.create(null);
    const rpsMap = Object.create(null);
    for (const e of errorPerService) {
    errorMap[e._id] = e.errorCount;
    }
    for (const r of throughputPerService) {
    rpsMap[r._id] = r.avgThroughputRPS;
    }
    const services = reqPerService.map(svc=>{
        console.log(svc)
        const errors = errorMap[svc._id]||0;
        const rps = rpsMap[svc._id]||0;
        const errorRate = svc.totalRequests === 0
                ? 0
                : +((errors / svc.totalRequests)*100).toFixed(2)
        const status  = getServiceHealth({ errorRate, totalRequests: svc.totalRequests })
        const healthScore =
            (errorRate * 5) +           
            (svc.p95Latency * 0.01) +  
            (rps * 0.1);  
        console.log(status)
        return {
            serviceName: svc._id,
            totalRequests: svc.totalRequests,
            avgThroughputRPS:rps.toFixed(2),
            errorCount: errors,
            errorRate:errorRate,
            status:status,
            avgLatency: svc.avgLatency.toFixed(2),
            p95Latency: svc.p95Latency,
            _healthScore: healthScore,
        }
    })
    services.sort((a, b) => b._healthScore - a._healthScore);
    services.forEach(s => delete s._healthScore);
    res.send({
        services
    })
})
module.exports = router