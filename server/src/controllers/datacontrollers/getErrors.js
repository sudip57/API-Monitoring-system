const errorEventModel = require('../../models/raw/errorEventModel');
async function geterrors(from,to,page=1,limit=50){
    const skip = (page-1)*limit;
    const errors = await errorEventModel.find( {timestamp:{ $gte: from, $lte: to }}).sort({timestamp:-1}).skip(skip).limit(limit).lean();
    const total = await errorEventModel.countDocuments({
    timestamp: { $gte: from, $lte: to }
  });
  return {
    errors,
    page,
    total,
    hasMore: skip + errors.length < total
  };
}
module.exports = geterrors;