const serviceDataModel = require('../models/serviceData')
const chartDataModel = require('../models/chartData')
async function runChartDataAggregation(){
const to = new Date();
const from = new Date(to.getTime() - 60*1000); 
const result = await serviceDataModel.aggregate([
  {
    $match: {
      "projectKey": "test-project",
      timestamp: { $gte: from, $lte: to }
    }
  },

  {
    $group: {
      _id: "$projectKey",
      totalRequests: { $sum: "$requestCount" },
      totalDuration: { $sum: "$totalDuration" },
      totalErrors: { $sum: "$errorCount" },
      p95Latency: { $max: "$p95Latency" }
    }
  },

  {
    $project: {
         _id: 0,
        projectKey:"$_id",
        totalRequests: 1,
        totalErrors: 1,
        timestamp: new Date(),
        avgLatency: {
        $cond: [
          { $gt: ["$totalRequests", 0] },
          {
            $round: [
              { $divide: ["$totalDuration", "$totalRequests"] },
              2
            ]
          },
          0
        ]
      },

      p95Latency: { $round: ["$p95Latency", 2] },

      errorRate: {
        $cond: [
          { $gt: ["$totalRequests", 0] },
          {
            $round: [
              {
                $multiply: [
                  { $divide: ["$totalErrors", "$totalRequests"] },
                  100
                ]
              },
              2
            ]
          },
          0
        ]
      },
      avgThroughput: {
        $round: [
          {
            $divide: [
              "$totalRequests",
              {
                $divide: [
                  { $subtract: [to, from] },
                  1000
                ]
              }
            ]
          },
          2
        ]
      }
    }
  }
]);
  if(result.length){
    await chartDataModel.insertMany(result)
    console.log("Saved chart rollups:", result.length);
  }else{
    console.log("no traffic")
  }
}
module.exports = runChartDataAggregation;