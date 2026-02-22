const express = require("express");
const router = express.Router();
const {getRouteStats,getServiceStats,getStats,getOverallChartData,getRouteChartData,getServiceChartData} = require("../controllers")
router.get("/serviceData",async(req,res)=>{
    const from = new Date(req.timeRange.from);
    const to = new Date(req.timeRange.to);
    const {serviceName} = req.query;
    const payload = await getServiceStats({from,to,serviceName});
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
    const overviewData = await getStats(from,to);
    res.send({
        overviewData
    });
})
router.get("/chartData",async (req,res)=>{
    const from = new Date(req.timeRange.from);
    const to = new Date(req.timeRange.to);
    const chartData = await getOverallChartData(from,to);
    res.send({
        chartData
    });
})
router.get("/chartData/route",async (req,res)=>{
    const from = new Date(req.timeRange.from);
    const to = new Date(req.timeRange.to);
    const chartData = await getRouteChartData(from,to);
    res.send({
        chartData
    });
})
router.get("/chartData/service",async (req,res)=>{
    const from = new Date(req.timeRange.from);
    const to = new Date(req.timeRange.to);
    const chartData = await getServiceChartData(from,to);
    res.send({
        chartData
    });
})
module.exports = router