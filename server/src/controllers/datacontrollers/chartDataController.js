const chartDataModel = require("../../models/chartData")
async function getChartData(from,to){
    const chartData = await chartDataModel.find({timestamp:{ $gte: from, $lte: to }});
    return chartData;
}
module.exports = getChartData;