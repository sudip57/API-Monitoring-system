const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors')
const express = require("express");
const app = express();
const timeRangeMiddleware = require("./src/middleware/timeRange");
require('./src/cron/serviceDataRollupWorker')
require('./src/cron/routeDataRollupWorker')
require('./src/cron/chartDataRollupWorker')
app.use(cors({
  origin: "*",
}));
app.use(express.json());
app.use("/ranged",timeRangeMiddleware);
app.use("/ranged/metrics", require("./src/routes/metrics"));
app.use("/resourceData", require("./src/routes/resourceMetricsData"));
app.use("/ingest", require("./src/routes/ingest"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("http://localhost:3000\n");
});