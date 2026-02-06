const {initialize,logger} = require("api-monitor-sdk");
const express = require("express");
const axios = require("axios");
const app = express();
initialize({
  projectKey: "test-project",
  serviceName: "service-a",
  env: "development",
},app);
app.get("/user/:id", async (req, res, next) => {
logger('hello',req.apm.traceId);
  if (req.params.id === "500") {
    throw new Error("Forced test error in /user/:id");
  }
  try {
    const serviceATrace = {
      service: "service-a",
      traceId: req.apm?.traceId || null,
      spanId: req.apm?.spanId || null,
    };
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

app.listen(4000, () => {
  console.log("Service A running on 4000");
});
