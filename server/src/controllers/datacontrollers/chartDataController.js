const chartDataModel = require("../../models/chartData")
const serviceDataModel = require("../../models/serviceData")
const routeChartDataModel = require("../../models/routeChartData")
async function getOverallChartData(from,to){
    const chartData = await chartDataModel.find(
        {
        timestamp:{ $gte: from, $lte: to },
    });
    return chartData;
}
async function getRouteChartData(config){
    const {from,to,routeName,serviceName}=config;
    const routeData = await routeChartDataModel.find(
        {
        timestamp:{ $gte: from, $lte: to },
        route:routeName,
        serviceName:serviceName,
    });
    return routeData;
}
async function getServiceChartData(config){
    const {from,to,serviceName}=config;
    const serviceData = await serviceDataModel.find(
        {
        timestamp:{ $gte: from, $lte: to },
        serviceName:serviceName
    });
    return serviceData;
}
module.exports = {getOverallChartData,getRouteChartData,getServiceChartData};