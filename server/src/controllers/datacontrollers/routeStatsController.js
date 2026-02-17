const routeDataModel = require("../../models/routeData")
async function getRouteStats(config){
    const {serviceName,from,to} = config;
    const windowSeconds = (to - from) / 1000;
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
            p95Latency:{ $max:"$p95Latency" },
            statusCount:{
                    $mergeObjects:"$statusCount"
                }
            }
        }
    ])
    const routeData = routeAgg.map(r =>{
        const errorCount = r.errorCount;
        const errorRate = r.totalRequests> 0 
            ? Number(((errorCount  / r.totalRequests) * 100).toFixed(2))
            : 0;
        const avgLatency = r.totalDuration/r.totalRequests;
        const statusInfo = r.statusCount || {};
        const successCount = (statusInfo["200"]||0)+(statusInfo["201"]||0)+(statusInfo["204"]||0);
        const clientErrors = Object.entries(statusInfo)
            .filter(([k])=>k.startsWith("4"))
            .reduce((a,[,v])=>a+v,0);
        const serverErrors = Object.entries(statusInfo)
            .filter(([k])=>k.startsWith("5"))
            .reduce((a,[,v])=>a+v,0);    
        return {
            routeName:r.route,
            methodName:r.method,
            totalRequests : r.totalRequests,
            throughPut:(r.totalRequests/windowSeconds).toFixed(2),
            avgLatency : Number(avgLatency.toFixed(2)),
            p95Latency : r.p95Latency,
            errorCount : errorCount,
            errorRate,
            successCount,
            clientErrors,
            serverErrors,
            statusInfo:statusInfo
        }
    })
    return routeData;
}
module.exports = getRouteStats;