const resourceMetricsModel = require("../models/raw/resourceMetricsModel");
async function getResourceData(projectKey){
const latestPerService = await resourceMetricsModel.aggregate([
      {
        $match: {
          "meta.projectKey": projectKey,
          timestamp: { $gte: new Date(Date.now() - 2 * 60 * 1000) }
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: "$meta.serviceName",
          latest: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$latest" },
      },
    ]);
return latestPerService;
}
module.exports = getResourceData;