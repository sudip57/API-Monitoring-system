const {getResourceData,getRouteStats,getServiceStats,getStats,getOverallChartData,getRouteChartData,getServiceChartData,getLogs,getErrors} = require("./datacontrollers")
const {saveEvents} = require("./store")
module.exports={getResourceData,getRouteStats,getServiceStats,getStats,saveEvents,getOverallChartData,getRouteChartData,getServiceChartData,getLogs,getErrors}