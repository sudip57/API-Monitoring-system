const requestEventModel = require("../models/requestEventModel");
const errorEventModel = require("../models/errorEventModel");
async function getTotalRequests({ projectKey, serviceName } = {}) {
  const query = {};
  if (projectKey) query.projectKey = projectKey;
  if (serviceName) query.serviceName = serviceName;
  const total = await requestEventModel.countDocuments(query);
  return total;
}
async function getAverageLatency({ projectKey, serviceName } = {}) {
  const match = {};
  if (projectKey) match.projectKey = projectKey;
  if (serviceName) match.serviceName = serviceName;

  const result = await requestEventModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        avgLatency: { $avg: "$request.duration" }
      }
    }
  ]);
  return result[0]?.avgLatency ?? 0;
}
async function getTotalErrors({ projectKey, serviceName } = {}) {
  const query = {};
  if (projectKey) query.projectKey = projectKey;
  if (serviceName) query.serviceName = serviceName;

  const total = await errorEventModel.countDocuments(query);
  return total;
}

module.exports = {getTotalRequests,getAverageLatency,getTotalErrors};