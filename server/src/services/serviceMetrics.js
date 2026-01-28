const requestEventModel = require("../models/requestEventModel")
const errorEventModel = require("../models/errorEventModel")
const serviceMetricsModel = require("../models/serviceMetricsModel")
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

function getBucket(timestamp) {
  return Math.floor(timestamp / 60000) * 60000;
}

function percentile(arr, p) {
  if (!arr.length) return 0;
  arr.sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * arr.length) - 1;
  return arr[index];
}

async function computeServiceMetrics() {
  const now = Date.now();
  const bucket = getBucket(now);
  const from = bucket - 60000;
  const to = bucket;
  const [reqPerService,errorPerService,throughputPerService] = await Promise.all([
        requestEventModel.aggregate([
            {$match:{
                "meta.projectKey":"test-project",
                "timestamp":{$gte:from,$lte:to}
            }},{
                $group:{
                    _id:"$meta.serviceName",
                    totalRequests:{$sum:1},
                    avgLatency:{$avg:"$duration"},
                    p95Latency:{
                    $percentile:{
                        input:"$duration",
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
                "timestamp":{$gte:from,$lte:to}
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
                    "timestamp": { $gte: from, $lte: to }
                    }
                },
                {
                    $group: {
                    _id: {
                        serviceName: "$meta.serviceName",
                        second: {
                        $dateTrunc: {
                            date: "$timestamp",
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
            return {
              meta:{
                projectKey:"test-project",
                serviceName: svc._id,
              },
              totalRequests: svc.totalRequests,
              avgThroughputRPS:rps.toFixed(2),
              errorCount: errors,
              errorRate:errorRate,
              status:status,
              avgLatency: svc.avgLatency.toFixed(2),
              p95Latency: svc.p95Latency[0],
              _healthScore: healthScore,
          } 
          })
await serviceMetricsModel.bulkWrite(services);
console.log("Service metrics computed for bucket:", bucket);
}
setInterval(computeServiceMetrics, 60000);
module.exports = computeServiceMetrics;