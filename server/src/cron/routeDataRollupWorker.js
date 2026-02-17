const requestEventModel = require("../models/raw/requestEventModel");
const routeDataModel = require("../models/routeData");

async function runRouteDataAggregation() {
  const to = new Date();
  const from = new Date(to.getTime() - 60 * 1000);

  const routeAgg = await requestEventModel.aggregate([
    {
      $match: {
        "meta.projectKey": "test-project",
        url: { $ne: null },
        timestamp: { $gte: from, $lte: to },
      },
    },

    {
      $group: {
        _id: {
          serviceName: "$meta.serviceName",
          route: "$url",
          method: "$method",
        },
        projectKey: { $first: "$meta.projectKey" },
        totalRequests: { $sum: 1 },
        sumLatency: { $sum: "$duration" },
        statusArray: { $push: "$statusCode" },

        p95Latency: {
          $percentile: {
            input: "$duration",
            p: [0.95],
            method: "approximate",
          },
        },
      },
    },
    {
      $addFields: {
        statusCount: {
          $arrayToObject: {
            $map: {
              input: { $setUnion: ["$statusArray"] },
              as: "code",
              in: {
                k: { $toString: "$$code" },
                v: {
                  $size: {
                    $filter: {
                      input: "$statusArray",
                      cond: { $eq: ["$$this", "$$code"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "errorEvents",
        let: {
          serviceName: "$_id.serviceName",
          route: "$_id.route",
          method: "$_id.method",
          projectKey: "$projectKey",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$meta.projectKey", "$$projectKey"] },
                  { $eq: ["$meta.serviceName", "$$serviceName"] },
                  { $eq: ["$url", "$$route"] },
                  { $eq: ["$method", "$$method"] },
                  { $gte: ["$timestamp", from] },
                  { $lte: ["$timestamp", to] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              errorCount: { $sum: 1 },
            },
          },
        ],
        as: "err",
      },
    },
    {
      $addFields: {
        errorCount: {
          $ifNull: [{ $arrayElemAt: ["$err.errorCount", 0] }, 0],
        },
      },
    },

    {
      $project: {
        _id: 0,
        projectKey: 1,
        serviceName: "$_id.serviceName",
        route: "$_id.route",
        method: "$_id.method",
        timestamp: new Date(),
        requestCount: "$totalRequests",
        totalDuration: "$sumLatency",
        errorCount: 1,
        statusCount: 1,
        p95Latency: { $first: "$p95Latency" },
      },
    },
  ]);

  if (routeAgg.length) {
    await routeDataModel.insertMany(routeAgg);
    console.log("Saved route rollups:", routeAgg.length);
  } else {
    console.log("no traffic");
  }
}

module.exports = runRouteDataAggregation;
