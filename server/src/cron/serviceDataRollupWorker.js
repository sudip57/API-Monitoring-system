const requestEventModel = require('../models/raw/requestEventModel')
const serviceDataModel = require('../models/serviceData')

async function runAggregation() {
  try {
    const to = new Date();
    const from = new Date(to.getTime() - 60 * 1000); 
    const rollups = await requestEventModel.aggregate([
      {
        $match: {
          "meta.projectKey": "test-project",
          timestamp: { $gte: from, $lte: to }
        }
      },
      {
        $group: {
          _id: "$meta.serviceName",
          projectKey:{ $first:"$meta.projectKey" },
          requestCount: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
          p95Latency:{
            $percentile:{
                input:"$duration",
                p:[0.95],
                method:"approximate"
            }
            }
        }
      },
      {
      $lookup: {
        from: "errorEvents",
        let: {
            serviceName: "$_id",
            projectKey: "$projectKey" 
            },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                    { $eq: ["$meta.projectKey", "$$projectKey"] },
                    { $eq: ["$meta.serviceName", "$$serviceName"] },
                    { $gte: ["$timestamp", from] },
                    { $lte: ["$timestamp", to] }
                ],
              },
            },
          },{
              $group: {
                _id: null,
                errorCount: { $sum: 1 }
              }
            }
          ],
          as: "err"
      },
    },
      {
        $addFields: {
          errorCount: {
            $ifNull: [{ $arrayElemAt: ["$err.errorCount", 0] }, 0]
          }
        }
      },
      {
        $project: {
            projectKey:1,
            _id: 0,
            serviceName: "$_id",
            timestamp: from,
            requestCount: 1,
            errorCount: 1,
            totalDuration: 1,
            p95Latency:{ $first: "$p95Latency" },
        }
      }
    ]);
    if (rollups.length) {
      await serviceDataModel.insertMany(rollups);
      console.log("Saved service rollups:", rollups.length);
    }else{
        console.log("no traffic")
    }

  } catch (err) {
    console.error("Aggregation error:", err);
  }
}
setInterval(runAggregation, 60000);
runAggregation();