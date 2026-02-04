const chartDataModel = require("../models/chartData")
async function getchartData(from,to){
    const chartData = await chartDataModel.find({timestamp:{ $gte: from, $lte: to }});
    return chartData;
}
module.exports = getchartData;