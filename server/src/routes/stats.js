// const statsModule = require("../controllers/statsController");
// console.log("statsModule:", statsModule);
// console.log("types:", {
//   totalRequests: typeof statsModule.totalRequests,
//   avgLatency:   typeof statsModule.avgLatency,
//   totalErrors:  typeof statsModule.totalErrors,
// });
// process.exit(0); // exit after printing so you can inspect then restart
const {totalRequests, avgLatency, totalErrors} = require("../controllers/statsController");
const express = require("express");
const router = express.Router();
router.get("/requests/total", totalRequests);
router.get("/requests/avg-latency",avgLatency);
router.get("/errors/total", totalErrors);
module.exports = router;