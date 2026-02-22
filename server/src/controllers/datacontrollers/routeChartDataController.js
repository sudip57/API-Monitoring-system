const routeDataModel = require("../../models/routeData")
async function getRouteChartData(from,to){
    const routeData = await routeDataModel.find(
        {
        timestamp:{ $gte: from, $lte: to }
    });
    return routeData;
}
module.exports = getRouteChartData;