const APM = require("api-monitor-sdk");
APM.initializeAPM({
  projectKey: "test-project",
  serviceName: "test-service",
  env: "development",
});
const axios = require("axios");
const express = require("express");
const PORT = process.env.PORT || 4000;
const app = express();

app.use(APM.apmMiddleware());

app.use((req, res, next) => {
  // tiny, safe debug log — can be removed
  // console.log('INCOMING REQ:', req.method, req.originalUrl, 'trace header:', req.headers['x-trace-id'] || req.headers['traceparent']);
  next();
});

// 4) Single route: root ~300ms total, with two external axios calls (child spans auto-created)
app.get('/', async (req, res, next) => {
  const data =  await axios.get('https://jsonplaceholder.typicode.com/posts/1');
  res.send('Hello World! Post 1 title: ' + data.data.title + '\nFetching another post...');
})
// 6) APM error middleware (optional) then final handler
if (APM.errorMiddleware && typeof APM.errorMiddleware === 'function') {
  app.use(APM.errorMiddleware());
}
app.use((err, req, res, next) => {
  console.error('[APP ERROR]', err && (err.message || err.toString()));
  res.status(500).json({ error: err && err.message });
});

// 7) Start
app.listen(PORT, () => {
  console.log(`Test server (auto spans, no manual spans) running on http://127.0.0.1:${PORT}`);
  console.log('Call GET / to create a root request (~300ms) and let SDK auto-create axios child spans.');
  console.log('Call GET /events to inspect captured events if your SDK exposes an events getter.');
});