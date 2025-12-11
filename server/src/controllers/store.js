const requestEventModel = require("../models/requestEvent");
const errorEventModel = require("../models/errorEvent");
const spanEventModel = require("../models/spanEvent");
const requests = []
const errors = []
const spans = []
function normalizeEvent(raw = {}) {
  console.log("Normalizing event:", raw);
  return {
    traceId: raw.traceId || null,
    method: String((raw.method || raw.httpMethod || "GET")).toUpperCase(),
    url: raw.url || raw.path || "/",
    message: raw.message || undefined,
    stack: raw.stack || undefined,
    route: raw.route || null,
    statusCode: typeof raw.statusCode === "number" ? raw.statusCode : (raw.status && Number(raw.status)) || undefined,
    duration: typeof raw.duration === "number" ? raw.duration : Number(raw.duration || 0),
    timestamp: raw.timestamp ? new Date(raw.timestamp) : new Date(),
    receivedAt: raw.receivedAt ? new Date(raw.receivedAt) : undefined,
    clientIp: raw.clientIp || raw.ip || raw.client || undefined,
    userAgent: raw.userAgent || (raw.headers && raw.headers["user-agent"]) || undefined,
    headers: raw.headers || undefined,
    bodySample: raw.bodySample || raw.body || undefined,
    tags: Array.isArray(raw.tags) ? raw.tags : (raw.tags ? [String(raw.tags)] : []),
    meta: raw.meta || undefined,
  };
}
function saveEvents(events) {
    console.log("Incoming event to save:", events);
    for(const event of events.data) {
    if(event.type == "request") {
      const docs = normalizeEvent(event);
      const doc = {
        projectKey:events.projectKey,
        serviceName:events.serviceName,
        timestamp:new Date(),
        request:docs,
      }
      requests.push(doc);
      console.log("Saved request:", requests);
      saveRequests(requests,requestEventModel);
    }
    if(event.type == "error") {
      console.log("Incoming error event to save:", event);
      const docs = normalizeEvent(event);
      const doc = {
        projectKey:events.projectKey,
        serviceName:events.serviceName,
        timestamp:new Date(),
        error:docs,
      }
      errors.push(doc);
      console.log("Saved request:", errors);
      saveRequests(errors,errorEventModel);
    }
    if(event.type == "span") {
      console.log("Incoming span event to save:", event);
      const doc = {
        projectKey:events.projectKey,
        serviceName:events.serviceName,
        timestamp:new Date(),
        span:event.span
      };
      spans.push(doc);
      console.log("Saved span request:", spans);
      saveRequests(spans,spanEventModel);
    }
  }
}
async function saveRequests(event,db) {
  console.log("events in db ",event);
  const res = await db.insertMany(event);
  const insertedCount = Array.isArray(res) ? res.length : 0;
  console.log(`ingestEvents: inserted ${insertedCount} docs`);
  requests.length = 0;
  errors.length = 0;
  spans.length = 0;
}
module.exports = {saveRequests,saveEvents};