const chartDataModel = require("../../models/chartData")
const serviceDataModel = require("../../models/serviceData")
const routeDataModel = require("../../models/routeData")
async function getOverallChartData(from,to){
    const chartData = await chartDataModel.find(
        {
        timestamp:{ $gte: from, $lte: to },
    });
    return chartData;
}
async function getRouteChartData(from,to){
    const routeData = await routeDataModel.find(
        {
        timestamp:{ $gte: from, $lte: to }
    });
    return routeData;
}
async function getServiceChartData(from,to){
    const serviceData = await serviceDataModel.find(
        {
        timestamp:{ $gte: from, $lte: to }
    });
    return serviceData;
}
module.exports = {getOverallChartData,getRouteChartData,getServiceChartData};