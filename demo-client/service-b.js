const {initialize,logger} = require("api-monitor-sdk");
const express = require("express");
const app = express();
initialize({
  projectKey: "test-project",
  serviceName: "service-b",
  env: "development",
},app);
app.get("/orders/:id", async (req, res, next) => {
  try {
    // simulate async work
    await new Promise(r => setTimeout(r, 50));
    res.json({
      service: "service-b",
      traceId: req.apm?.traceId || null,
      spanId: req.apm?.spanId || null,
      parentSpanId: req.apm?.parentSpanId || null,
    });
  } catch (err) {
    next(err);
  }
});

app.listen(4001, () => {
  console.log("Service B running on 4001");
});
