const logEventModel = require('../../models/raw/logsModel');
async function getLogs(from,to,page=1,limit=50){
    const skip = (page-1)*limit;
    const logs = await logEventModel.find( {timestamp:{ $gte: from, $lte: to }}).sort({timestamp:-1}).skip(skip).limit(limit).lean();
    const total = await logEventModel.countDocuments({
    timestamp: { $gte: from, $lte: to }
  });
  return {
    logs,
    page,
    total,
    hasMore: skip + logs.length < total
  };
}
module.exports = getLogs;