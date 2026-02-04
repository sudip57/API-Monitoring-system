const APM = require("api-monitor-sdk");
const express = require("express");
const axios = require("axios");
APM.initializeAPM({
  projectKey: "test-project",
  serviceName: "service-a",
  env: "development",
});
const app = express();
app.use(APM.apmMiddleware());

app.get("/user/:id", async (req, res, next) => {
APM.logger('hello',req.apm.traceId);
  if (req.params.id === "500") {
    throw new Error("Forced test error in /user/:id");
  }
  try {
    const serviceATrace = {
      service: "service-a",
      traceId: req.apm?.traceId || null,
      spanId: req.apm?.spanId || null,
    };
    // outbound HTTP call (axios instrumentation should inject headers)
    const response = await axios.get(
      `http://localhost:4001/orders/${req.params.id}`
    );
    res.json({
      serviceA: serviceATrace,
      serviceB: response.data,
    });
  } catch (err) {
    next(err);
  }
});

if (APM.errorMiddleware) {
  app.use(APM.errorMiddleware());
}

app.listen(4000, () => {
  console.log("Service A running on 4000");
});
