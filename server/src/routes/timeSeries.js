const express = require("express");
const router = express.Router();

const requestEventModel = require("../models/requestEventModel");
const errorEventModel = require("../models/errorEventModel");

function getBucketSizeMs(from, to) {
  const diffMs = to - from;
  const desiredBuckets = 30;
  const rawBucketMs = Math.ceil(diffMs / desiredBuckets);

  if (rawBucketMs <= 60_000) return 60_000;         
  if (rawBucketMs <= 5 * 60_000) return 5 * 60_000;  
  if (rawBucketMs <= 15 * 60_000) return 15 * 60_000;
  return 60 * 60_000;                              
}

function generateBuckets(from, to, bucketMs) {
  const buckets = [];
  const alignedFrom = from.getTime() - (from.getTime() % bucketMs);

  for (let t = alignedFrom; t <= to.getTime(); t += bucketMs) {
    buckets.push(t);
  }
  return buckets;
}



async function timeSeriesData(from, to) {
  const bucketMs = getBucketSizeMs(from, to);
  const bucketSeconds = bucketMs / 1000;

  const unitMap = {
    60000: "minute",
    300000: "minute",
    900000: "minute",
    3600000: "hour",
  };

  const binSizeMap = {
    60000: 1,
    300000: 5,
    900000: 15,
    3600000: 1,
  };

  const unit = unitMap[bucketMs];
  const binSize = binSizeMap[bucketMs];



  const requestSeries = await requestEventModel.aggregate([
    {
      $match: {
        timestamp: { $gte: from, $lte: to }
      }
    },
    {
      $group: {
        _id: {
          $dateTrunc: {
            date: "$timestamp",
            unit,
            binSize
          }
        },
        requestCount: { $sum: 1 },
        avgLatency: { $avg: "$duration" },
        p95Latency: {
          $percentile: {
            input: "$duration",
            p: [0.95],
            method: "approximate"
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);


  const errorSeries = await errorEventModel.aggregate([
    {
      $match: {
        timestamp: { $gte: from, $lte: to }
      }
    },
    {
      $group: {
        _id: {
          $dateTrunc: {
            date: "$timestamp",
            unit,
            binSize
          }
        },
        errorCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);


  const requestMap = new Map(
    requestSeries.map(r => [r._id.getTime(), r])
  );

  const errorMap = new Map(
    errorSeries.map(e => [e._id.getTime(), e.errorCount])
  );

  const buckets = generateBuckets(from, to, bucketMs);

  const series = buckets.map(ts => {
    const r = requestMap.get(ts);
    const errors = errorMap.get(ts) || 0;

    const requestCount = r?.requestCount || 0;
    const requestRate = requestCount / bucketSeconds;

    const errorRate =
      requestCount > 0 ? (errors / requestCount) * 100 : 0;

    const MIN_P95_SAMPLES = 5;
    const p95Latency =
      requestCount >= MIN_P95_SAMPLES
        ? r?.p95Latency?.[0] ?? null
        : null;

    return {
      timestamp: ts,
      requestCount,
      requestRate: Number(requestRate.toFixed(2)),
      errorRate: Number(errorRate.toFixed(2)),
      errorCount: errors,
      avgLatency: r ? Math.round(r.avgLatency || 0) : 0,
      p95Latency
    };
  });

  return series.sort((a, b) => a.timestamp - b.timestamp);
}

// ---------------- ROUTE ----------------

router.get("/", async (req, res) => {
  const from = new Date(req.timeRange.from);
  const to = new Date(req.timeRange.to);

  const timeSeries = await timeSeriesData(from, to);

  res.send({ timeSeries });
});

module.exports = router;