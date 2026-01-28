const requestEventModel = require("../models/requestEventModel");
const errorEventModel = require("../models/errorEventModel");
const spanEventModel = require("../models/spanEvents")
const logEventModel = require("../models/logsModel")

function extractFields(event) {
  const COMMON_FIELDS = [
    "traceId",
    "spanId",
    "parentSpanId",
    "url",
    "method",
    "statusCode",
    "duration",
    "message",
    "stack",
    "level",
    "cpu",
    "memory",
    "systemMemory",
    "uptimeSec",
    "network",
    "parentUrl",
    "parentRootId"
  ];

  const result = {};

  for (const key of COMMON_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(event, key)) {
      result[key] = event[key]; 
    }
  }

  return result;
}


function normalizeDate(value) {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  return new Date();
}

async function saveEvents(events) {
  const requests = [];
  const errors = [];
  const spans = [];
  const rootSpans = [];
  const logs = [];
  const resourceMetrics = [];
  for (const event of events.data) {

    // REQUEST
    if (event.type === "request") {
      requests.push({
        meta:{
          projectKey: events.projectKey,
          serviceName: events.serviceName,
        },
        timestamp: normalizeDate(event.timestamp),
        ...extractFields(event)
      });
    }

    // ERROR
    if (event.type === "error") {
      errors.push({
        meta:{
          projectKey: events.projectKey,
          serviceName: events.serviceName,
        },
        timestamp: normalizeDate(event.timestamp),
        ...extractFields(event)
      });
    }

    // LOG
    if (event.type === "log") {
      logs.push({
        meta:{
          projectKey: events.projectKey,
          serviceName: events.serviceName,
        },
        timestamp: normalizeDate(event.timestamp),
       ...extractFields(event)
      });
    }

    // CHILD SPAN
    if (event.info === "childSpan"||event.info === "rootSpan") {
      spans.push({
        info: event.info,
        meta:{
          projectKey: events.projectKey,
          serviceName: events.serviceName,
        },
        timestamp: normalizeDate(event.timestamp),
        ...extractFields(event)
      });
    }
    // RESOURCE METRICS
    if (event.type === "resource-metrics") {
      resourceMetrics.push({
        meta:{
          projectKey: events.projectKey,
          serviceName: events.serviceName,
        },
        timestamp: normalizeDate(event.timestamp),
        ...extractFields(event)
      });
    }
  }

if (requests.length) await requestEventModel.insertMany(requests);
if (errors.length) await errorEventModel.insertMany(errors);
if (logs.length) await logEventModel.insertMany(logs);
if (spans.length) await spanEventModel.insertMany(spans);
if (resourceMetrics.length) {
  const resourceMetricsModel = require("../models/resourceMetricsModel");
  await resourceMetricsModel.insertMany(resourceMetrics);
}

}

module.exports = {saveEvents};