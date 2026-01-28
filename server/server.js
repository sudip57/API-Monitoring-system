const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors')
const express = require("express");
const app = express();
const ingestRoute = require("./src/routes/ingest");
const statsRoute = require("./src/routes/stats");
const timeRangeMiddleware = require("./src/middleware/timeRange");
app.use(cors({
  origin: "*",
}));
app.use(express.json());
app.use("/api",timeRangeMiddleware);
app.use("/api/overview", require("./src/routes/overview"));
app.use("/api/stats", require("./src/routes/stats"));
app.use("/api/timeSeries", require("./src/routes/timeSeries"));
app.use("/api/services", require("./src/routes/servicesData"));
app.use("/api/routes", require("./src/routes/routesOverview"));
app.use("/resourcedata", require("./src/routes/resourceMetricsData"));
app.use("/ingest", ingestRoute);
app.use("/stats", statsRoute);
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("http://localhost:3000\n");
});