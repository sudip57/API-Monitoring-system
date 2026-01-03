const APM = require("api-monitor-sdk");
const express = require("express");

APM.initializeAPM({
  projectKey: "test-project",
  serviceName: "service-b",
  env: "development",
});

const app = express();
app.use(APM.apmMiddleware());
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

if (APM.errorMiddleware) {
  app.use(APM.errorMiddleware());
}

app.listen(4001, () => {
  console.log("Service B running on 4001");
});
