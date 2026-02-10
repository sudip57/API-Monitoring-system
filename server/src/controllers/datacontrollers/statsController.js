const express = require("express");
const router = express.Router();
const serviceDataModel = require('../../models/serviceData')
async function getStats(from,to){
const result = await serviceDataModel.aggregate([
  {
    $match: {
      projectKey: "test-project",
      timestamp: { $gte: from, $lte: to }
    }
  },

  {
    $group: {
      _id: null,

      totalRequests: { $sum: "$requestCount" },
      totalDuration: { $sum: "$totalDuration" },
      totalErrors: { $sum: "$errorCount" },
      p95Latency: { $max: "$p95Latency" }
    }
  },

  {
    $project: {
      totalRequests: 1,
      totalErrors: 1,

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
return result[0];
}
module.exports = getStats;