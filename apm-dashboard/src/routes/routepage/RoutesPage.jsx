import React, { useState } from "react";
import LatencyChartCard from '../../features/monitoring/components/LatencyChartCard'
import { 
  ArrowLeft, Clock, Zap, ShieldAlert, 
  BarChart3, Activity, Globe, Monitor 
} from "lucide-react";
import { useSearchParams,useParams } from "react-router-dom";
import TimeRangePicker from "../../components/ui/TimeRangePicker";
import { useRouteData } from "../../services/useRouteData";
import { useAppContext } from "../../context/GlobalAppContext";
import { useRouteChartData } from "../../services/useRouteChartData";
import RequestChartCard from "../../features/monitoring/components/RequestChartCard";
import ErrorChartCard from "../../features/monitoring/components/ErrorChartCard";
import { trendFinder } from "../../utils/trendFinder";
import StatusDistribution from "./components/StatusDistribution";
const RoutesPage = () => {
  const {timeRange} = useAppContext();
  const [searchParams] = useSearchParams();
  const routeName = searchParams.get("routeName");
  const { serviceName } = useParams();
  const {data,error,loading}=useRouteData({timeRange:timeRange.rangeMinutes,serviceName,routeName})
  const {chartdata,charterror,chartloading}=useRouteChartData({timeRange:timeRange.rangeMinutes,serviceName,routeName})
  const routeData = data?.routeData[0]
  console.log(routeData)
  const {trend} = trendFinder(routeData);
  console.log("trend----",trend)
  return (
    <div className="min-h-screen bg-[#050507] text-zinc-300 p-8 font-sans">
      {/* 1. Navigation & Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">GET</span>
              <h1 className="text-xl font-mono font-bold text-white tracking-tight">{routeName}</h1>
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">{serviceName} • Analytics</p>
          </div>
        </div>
        <TimeRangePicker/>
      </div>
      {/* 2. Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Avg Latency", val: `${routeData?.avgLatency}`,unit:"ms", icon: <Clock size={16} className="text-blue-400"/>, trend: `${trend?.latency}`},
          { label: "P95 Latency", val: `${routeData?.p95Latency}`,unit:"ms", icon: <Zap size={16} className="text-amber-400"/>, trend: `${trend?.p95Latency}` },
          { label: "Throughput", val: `${routeData?.avgThroughPut}`,unit:"rps", icon: <Activity size={16} className="text-emerald-400"/>, trend: `${trend?.rps}` },
          { label: "Error Rate", val: `${routeData?.errorRate}`,icon: <ShieldAlert size={16} className="text-rose-500"/>,  trend: `${trend?.errorRate}` },
          { label: "Total Requests", val: `${routeData?.totalRequests}`, icon: <ShieldAlert size={16} className="text-rose-500"/>, trend:`${trend?.totalRequests}`},
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-white/5 rounded-lg">{stat.icon}</div>
              <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
                {stat.trend}%
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{stat.label}</p>
            <p className="text-2xl font-mono font-bold text-white tracking-tighter">{stat.val} {stat.unit?stat.unit:""}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
      <LatencyChartCard data={chartdata} error={charterror} loading={chartloading}/>
      <StatusDistribution routeData={routeData}/>
      <RequestChartCard data={chartdata} error={charterror} loading={chartloading}/>
      <ErrorChartCard data={chartdata} error={charterror} loading={chartloading}/>
      </div>
    </div>
  );
};

export default RoutesPage;