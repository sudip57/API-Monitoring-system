const requestEventModel = require("../models/requestEventModel");
const errorEventModel = require("../models/errorEventModel");
const rootSpanEventModel = require("../models/rootSpanEventModel");
const childSpanEventModel = require("../models/childSpanModel");
const logEventModel = require("../models/logsModel")
function normalizeDate(value) {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  return new Date();
}

function saveEvents(events) {
  const requests = [];
  const errors = [];
  const childSpans = [];
  const rootSpans = [];
  const logs = [];

  for (const event of events.data) {

    // REQUEST
    if (event.type === "request") {
      requests.push({
        projectKey: events.projectKey,
        serviceName: events.serviceName,
        timestamp: normalizeDate(event.timestamp),
        request: {
          ...event,
          timestamp: normalizeDate(event.timestamp),
        },
      });
    }

    // ERROR
    if (event.type === "error") {
      errors.push({
        projectKey: events.projectKey,
        serviceName: events.serviceName,
        timestamp: normalizeDate(event.timestamp),
        error: {
          ...event,
          timestamp: normalizeDate(event.timestamp),
        },
      });
    }

    // LOG
    if (event.type === "log") {
      logs.push({
        projectKey: events.projectKey,
        serviceName: events.serviceName,
        timestamp: normalizeDate(event.timestamp),
        log: event.log,
      });
    }

    // CHILD SPAN
    if (event.info === "childSpan") {
      childSpans.push({
        info: event.info,
        projectKey: events.projectKey,
        serviceName: events.serviceName,
        timestamp: normalizeDate(event.span?.startTime),
        span: event.span,
      });
    }

    // ROOT SPAN
    if (event.info === "rootSpan") {
      rootSpans.push({
        info: event.info,
        projectKey: events.projectKey,
        serviceName: events.serviceName,
        timestamp: normalizeDate(event.span?.startTime),
        span: event.span,
      });
    }
  }

  if (requests.length) requestEventModel.insertMany(requests);
  if (errors.length) errorEventModel.insertMany(errors);
  if (logs.length) logEventModel.insertMany(logs);
  if (childSpans.length) childSpanEventModel.insertMany(childSpans);
  if (rootSpans.length) rootSpanEventModel.insertMany(rootSpans);
}

// function saveEvents(events) {
//     const requests = []
//     const errors = []
//     const childSpans = []
//     const rootSpans = []
//     const logs = []
//     console.log("Incoming event to save:", events);
//     for(const event of events.data) {
//     if(event.type == "request") {
//       const doc = {
//         projectKey:events.projectKey,
//         serviceName:events.serviceName,
//         timestamp:new Date(),
//         request:event,
//       }
//       requests.push(doc);
//       console.log('saved req',event);
//       console.log("Saved request:", requests);
//     }
//     if(event.type == "error") {
//       console.log("Incoming error event to save:", event);
//       const doc = {
//         projectKey:events.projectKey,
//         serviceName:events.serviceName,
//         timestamp:new Date(),
//         error:event,
//       }
//       errors.push(doc);
//       console.log("Saved request error:", errors);
//     }
//     if(event.type == "log") {
//       console.log("--------Incoming logs to save:----", event);
//       const doc = {
//         projectKey:events.projectKey,
//         serviceName:events.serviceName,
//         timestamp:new Date(),
//         log:event.log,
//       }
//       logs.push(doc);
//       console.log("Saved request:", logs);
//     }
//     if(event.info == "childSpan") {
//       console.log("Incoming span event to save:", event);
//       const doc = {
//         info: event.info,
//         projectKey:events.projectKey,
//         serviceName:events.serviceName,
//         timestamp:new Date(),
//         span:event.span
//       };
//       childSpans.push(doc);
//       console.log("Saved span request:", childSpans);
//     }
//     if(event.info == "rootSpan") {
//       console.log("Incoming span event to save:", event);
//       const doc = {
//         info: event.info,
//         projectKey:events.projectKey,
//         serviceName:events.serviceName,
//         timestamp:new Date(),
//         span:event.span
//       };
//       rootSpans.push(doc);
//       console.log("Saved span request:", rootSpans);
//     }
//   }
//   try {
//     if(requests.length>0){
//       requestEventModel.insertMany(requests).then((res)=>{
//         console.log(`ingestEvents: inserted ${res.length} request docs`);
//       }).catch((err)=>{
//         console.error("Error inserting request events:", err);
//       });
//     }
//     }
//     catch(err){
//       console.error("Error in request insertion:", err);
//     }
//   try{
//       if(logs.length>0){
//         logEventModel.insertMany(logs).then((res)=>{
//           console.log(`ingestEvents: inserted ${res.length} logs docs`);
//         }).catch((err)=>{
//           console.error("Error inserting logs events:", err);
//         });
//       }
//     }
//     catch(err){
//       console.error("Error in request insertion:", err);
//     }
//   try {
//     if(errors.length>0){
//       errorEventModel.insertMany(errors).then((res)=>{
//         console.log(`ingestEvents: inserted ${res.length} error docs`);
//       }).catch((err)=>{
//         console.error("Error inserting error events:", err);
//       });
//     }
//   }catch(err){
//     console.error("Error in error insertion:", err);
//   }
//   try {
//     if(childSpans.length>0){
//       childSpanEventModel.insertMany(childSpans).then((res)=>{
//         console.log(`ingestEvents: inserted ${res.length} child span docs`);
//       }).catch((err)=>{
//         console.error("Error inserting child span events:", err);
//       });
//     }
//   }catch(err){
//       console.error("Error in child span insertion:", err);
//     }
//   try {
//     if(rootSpans.length>0){
//       rootSpanEventModel.insertMany(rootSpans).then((res)=>{
//         console.log(`ingestEvents: inserted ${res.length} root span docs`);
//       }).catch((err)=>{
//         console.error("Error inserting root span events:", err);
//       });
//     }
//   }catch(err){
//       console.error("Error in root span insertion:", err);
//     }
// }

module.exports = {saveEvents};