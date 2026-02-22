const serviceDataModel = require("../../models/serviceData")
async function getServiceChartData(from,to,type){
    const serviceData = await serviceDataModel.find(
        {
        timestamp:{ $gte: from, $lte: to }
    });
    return serviceData;
}
module.exports = getServiceChartData;