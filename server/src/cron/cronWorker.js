const runChartDataAggregation = require("./chartDataRollupWorker")
const runRouteDataAggregation = require("./routeDataRollupWorker")
const runServiceDataAggregation = require("./serviceDataRollupWorker")
async function runPipeline() {
  await runServiceDataAggregation();
  await runRouteDataAggregation();
  await runChartDataAggregation();
}
setInterval(runPipeline, 60000);
runPipeline();
