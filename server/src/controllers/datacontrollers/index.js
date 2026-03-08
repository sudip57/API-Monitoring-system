const {getOverallChartData,getRouteChartData,getServiceChartData} = require("./chartDataController")
const getResourceData = require("./resourceDataController")
const getLogs = require("./getLogs")
const getRouteStats = require("./routeStatsController")
const getServiceStats = require("./serviceStatsController")
const getStats = require("./statsController")
module.exports = {getResourceData,getRouteStats,getServiceStats,getStats,getOverallChartData,getRouteChartData,getServiceChartData,getLogs}