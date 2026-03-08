const dotenv = require('dotenv');
dotenv.config();
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors')
const express = require("express");
const app = express();
const timeRangeMiddleware = require("./src/middleware/timeRange");
require('./src/cron/cronWorker')
app.use(cors({
  origin: "*",
}));
app.use(express.json());
app.use("/ranged",timeRangeMiddleware);
app.use("/ranged/metrics", require("./src/routes/metrics"));
app.use("/resourceData", require("./src/routes/resourceMetricsData"));
app.use("/ingest", require("./src/routes/ingest"));
const server = http.createServer(app);
const io = new Server(server,{
   cors: {
    origin: "*", 
  },
});
app.set("io", io);
io.on("connection", (socket) => {
  console.log("Client Connected:", socket.id);
  socket.on("logs-req-service", (roomId) => {
    socket.join(roomId);
  });
  socket.on("errors-req-service", (roomId) => {
    socket.join(roomId);
  });
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});

server.listen(3000, () => {
  console.log("http://localhost:3000\n");
});