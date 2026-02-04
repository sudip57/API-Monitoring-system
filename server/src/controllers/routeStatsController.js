const routeDataModel = require("../models/routeData")
async function getRouteStats(config){
    const {serviceName,from,to} = config;
    const routeAgg = await routeDataModel.aggregate([
        {
            $match: {
            "projectKey": "test-project",
            "serviceName": serviceName,
            timestamp: { $gte: from, $lte: to }
            }
        },
        {
            $group:{
            _id: "$serviceName",
            route:{$first:"$route"},
            method:{$first:"$method"},
            totalRequests: { $sum: "$requestCount" },
            totalDuration: { $sum: "$totalDuration" },
            errorCount: {$sum:"$errorCount"},
            p95Latency:{ $max:"$p95Latency" }
            }
        }
    ])
    const routeData = routeAgg.map(r =>{
        const errorCount = r.errorCount;
        const errorRate = r.totalRequests> 0 
            ? Number(((errorCount  / r.totalRequests) * 100).toFixed(2))
            : 0;
        const avgLatency = r.totalDuration/r.totalRequests;
        return {
            routeName:r.route,
            methodName:r.method,
            totalRequests : r.totalRequests,
            avgLatency : Number(avgLatency.toFixed(2)),
            p95Latency : r.p95Latency,
            errorCount : errorCount,
            errorRate,
        }
    })
    return routeData;
}
module.exports = getRouteStats;