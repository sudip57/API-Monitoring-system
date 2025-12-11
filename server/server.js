const express = require("express");
const app = express();
const ingestRoute = require("./src/routes/ingest");
const statsRoute = require("./src/routes/stats");
app.use(express.json());
app.use("/ingest", ingestRoute);
app.use("/stats", statsRoute);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(3000, () => {
  console.log("http://localhost:3000\n");
});