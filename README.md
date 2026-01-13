<img width="1905" height="909" alt="image" src="https://github.com/user-attachments/assets/df908690-00a4-452e-8e90-1802a2f64985" />

# Application Performance Monitoring (APM) System

A custom-built Application Performance Monitoring (APM) system that instruments Node.js services to collect, aggregate, and visualize performance metrics such as request latency, error rate, database performance, and request-level traces.

This project focuses on understanding how real APM tools work internally — from instrumentation and tracing to backend aggregation and visualization.

> ⚠️ **Project Status:** Active Development  
> Core functionality is implemented and functional. Some production-grade features are intentionally not implemented yet.

---

## 🎯 Project Objectives

- Build a real APM pipeline from scratch
- Understand request instrumentation and tracing
- Aggregate performance metrics over time windows
- Visualize backend health using a dashboard
- Learn system design trade-offs in monitoring systems

---

## 🏗️ Architecture Overview

The system follows a modular client–server architecture with a custom SDK for instrumentation.

```text
[ Instrumented Node.js Service ]
          |
          |  (APM SDK)
          v
[ Metrics Ingestion API (Express) ]
          |
          |  Aggregation Logic
          v
[ MongoDB (Metrics & Time-Series Data) ]
          |
          v
[ React Dashboard ]
```

### Architecture Notes
- SDK initializes request-level trace context at request entry
- Trace context is propagated across async operations within the same service
- Aggregation is handled synchronously in the backend (no workers/queues yet)

---

## 📦 SDK & Instrumentation

The project includes a **custom Node.js APM SDK** responsible for capturing telemetry data from instrumented services.

### Implemented Capabilities

#### HTTP Request Instrumentation
- Intercepts incoming Express requests
- Measures end-to-end request latency
- Captures route, method, and response status
- Associates requests with a service name

#### MongoDB Instrumentation
- Intercepts MongoDB/Mongoose operations
- Measures database call latency
- Correlates DB operations with the active request trace

#### Error Capture
- Captures errors:
  - Inside Express request lifecycle
  - Outside Express scope
- Handles:
  - Unhandled promise rejections
  - Uncaught exceptions

#### Tracing
- Request-scoped tracing within a **single Node.js service**
- Maintains trace context across asynchronous operations
- Correlates:
  - HTTP requests
  - Database operations
  - Errors
- Generates trace and span timing data per request
---

## 📊 Metrics & Aggregation

### Implemented Metrics
- Request count
- Error count
- Error rate
- Average latency
- p95 latency
- Throughput (requests per second)
- Time-series bucketed metrics

### Aggregation Model
- Metrics aggregated over configurable time windows
- Supports current vs previous window comparison
- Handles zero-traffic windows explicitly

---

## 🗄️ Storage Layer

- MongoDB used for:
  - Aggregated metrics
  - Time-series data
- Service-based metric grouping
- Time-range–based querying

### Current Limitations
- No TTL or archival strategy
- No write-optimization for high ingestion rates
- Free-tier latency constraints

---

## 🖥️ Dashboard & Visualization

### Implemented Features
- Service overview metrics
- Error rate trends
- Throughput graphs
- Latency charts
- Time-range filtering
- Real backend data (no mocks)

### Not Implemented
- Drill-down trace views
- Advanced filtering
- UX polish

---

## 📈 Current Implementation Status

### Implemented
- End-to-end APM pipeline
- Metrics ingestion APIs
- SDK-based request instrumentation , MongoDB instrumentation , Error capturing (inside & outside Express) , logger
- Request-level tracing (single service and multiple service)
- Metrics aggregation & time-series generation
- Dashboard with live data

### Partially Implemented
- SDK packaging & API polish
- Trend comparison edge cases
- UI/UX refinements

### Not Implemented (By Design)
- Authentication & multi-tenancy
- Alerting & notifications
- Distributed tracing
- Background workers / queues
- Production-scale optimizations

---

## 🧠 Design Philosophy

This project prioritizes **correctness and understanding** over polish.

Key focus areas:
- low configuration code in client application
- Instrumentation overhead vs accuracy
- Request correlation and trace context
- Aggregation correctness
- Realistic backend system design
---
