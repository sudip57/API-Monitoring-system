const express = require("express");
const router = express.Router();
// const getServiceStats = require("../controllers/datacontrollers/serviceStatsController")
// const getRouteStats = require("../controllers/datacontrollers/routeStatsController")
// const getStats = require("../controllers/datacontrollers/statsController")
// const getChartData = require("../controllers/datacontrollers/chartDataController")
const {getChartData,getRouteStats,getServiceStats,getStats} = require("../controllers")
router.get("/serviceData",async(req,res)=>{
    const from = new Date(req.timeRange.from);
    const to = new Date(req.timeRange.to);
    const payload = await getServiceStats(from,to);
    res.send({
        servicesData:payload,
    })
})
router.get("/routeData",async(req,res)=>{
    const from = new Date(req.timeRange.from);
    const to = new Date(req.timeRange.to);
    const {serviceName} = req.query;
    const routeData = await getRouteStats({from,to,serviceName})
    res.send({
        routeData
    })
})
router.get("/stats",async (req,res)=>{
    const from = new Date(req.timeRange.from);
    const to = new Date(req.timeRange.to);
    const data = await getStats(from,to);
    res.send(data);
})
router.get("/chartData",async (req,res)=>{
    const from = new Date(req.timeRange.from);
    const to = new Date(req.timeRange.to);
    const data = await getChartData(from,to);
    res.send(data);
})
module.exports = router