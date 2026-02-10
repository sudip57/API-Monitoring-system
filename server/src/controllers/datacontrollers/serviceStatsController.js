const serviceDataModel = require('../../models/serviceData')
const resourceMetricsModel = require('../../models/raw/resourceMetricsModel')
function getServiceHealth({ errorRate, totalRequests }) {
  if (totalRequests < 50) {
    return "No Data"
  }

  if (errorRate < 0.1) {
    return "Healthy"
  }

  if (errorRate < 0.5) {
    return "Degraded"
  }

  if (errorRate < 1) {
    return "Unhealthy"
  }
  return "Critical"
}
async function getServiceStats(from,to){
    const now = Date.now();
    const windowSeconds = (to - from) / 1000;
    const serviceInfo = await resourceMetricsModel.aggregate([
        { $match: { "meta.projectKey":"test-project" } },

        { $sort: { timestamp:-1 } },

        {
            $group:{
            _id:"$meta.serviceName",
            timestamp:{ $first:"$timestamp" },
            upTime:{ $first:"$uptimeSec" }
            }
        }
        ]);
    console.log(serviceInfo)
    const serviceData = serviceInfo.map((item)=>{
        const timestamp = new Date(item.timestamp)
        const diff = now-timestamp;
        let serviceStatus;
        let upTime
        if(diff>60000){
            serviceStatus = "down";
            upTime=0;
        }else{
            serviceStatus = "up";
            upTime = item.upTime;
        }
        return {
                serviceName:item._id,
                serviceStatus,
                upTime,
            }
    })
    const serviceMap = Object.create(null);
    const serviceRollup = await serviceDataModel.aggregate([
        {
        $match: {
          "projectKey": "test-project",
          timestamp: { $gte: from, $lte: to }
        }
      },
      {
        $group: {
          _id: "$serviceName",
          totalRequests: { $sum: "$requestCount" },
          totalDuration: { $sum: "$totalDuration" },
          errorCount: {$sum:"$errorCount"},
          p95Latency:{ $max:"$p95Latency" }
        }
      },
        ]);
    console.log(serviceRollup)
    const serviceStats = serviceRollup.map(svc=>{
        const avgThroughPut = svc.totalRequests/windowSeconds;
        const avgLatency = svc.totalDuration/svc.totalRequests;
        const errorRate = svc.totalRequests === 0
                ? 0
                : +((svc.errorCount / svc.totalRequests)*100).toFixed(2)
        const status  = getServiceHealth({ errorRate, totalRequests: svc.totalRequests })
        return{
            serviceName: svc._id,
            data:{
            avgThroughPut: Number(avgThroughPut.toFixed(2)),
            totalRequests: svc.totalRequests,
            avgLatency: Number(avgLatency.toFixed(2)),
            healthStatus:status,
            p95Latency:Number(svc.p95Latency.toFixed(2)),
            errorCount:svc.errorCount,
            errorRate
            }
            
        }
    })
    for(const s of serviceStats){
        serviceMap[s.serviceName] = s.data;
    }
    const payload = serviceData.map(svc=>{
        const data = serviceMap[svc.serviceName];
        const stats = data!=null?data:"no traffic"
        return{
            ...svc,
            stats
        }
    })
    return payload
}
module.exports = getServiceStats;