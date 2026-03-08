const logEventModel = require('../../models/raw/logsModel');
async function getLogs(from,to){
    const logData = await logEventModel.find( {timestamp:{ $gte: from, $lte: to }})
    return logData;
}
module.exports = getLogs;