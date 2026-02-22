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
// Dummy Data for Charts/Details
const DUMMY_HISTORY = [
  { time: "12:00", p95: 120, rps: 45, errors: 0 },
  { time: "12:05", p95: 145, rps: 52, errors: 1 },
  { time: "12:10", p95: 450, rps: 89, errors: 12 }, // Spike
  { time: "12:15", p95: 180, rps: 60, errors: 2 },
  { time: "12:20", p95: 130, rps: 48, errors: 0 },
];

const RoutesPage = () => {
  const {timeRange} = useAppContext();
  const [searchParams] = useSearchParams();
  const routeName = searchParams.get("routeName");
  const { serviceName } = useParams();
  const {data,error,loading}=useRouteData({timeRange:timeRange.rangeMinutes,serviceName,routeName})
  const {chartdata,charterror,chartloading}=useRouteChartData({timeRange:timeRange.rangeMinutes,serviceName,routeName})
  const routeData = data?.routeData[0]
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
          { label: "Avg Latency", val: `${routeData?.avgLatency}`,unit:"ms", icon: <Clock size={16} className="text-blue-400"/>, trend: "-12%" },
          { label: "P95 Latency", val: `${routeData?.p95Latency}`,unit:"ms", icon: <Zap size={16} className="text-amber-400"/>, trend: "+5%" },
          { label: "Throughput", val: `${routeData?.avgThroughPut}`,unit:"rps", icon: <Activity size={16} className="text-emerald-400"/>, trend: "+18%" },
          { label: "Error Rate", val: `${routeData?.errorRate}`,icon: <ShieldAlert size={16} className="text-rose-500"/>, trend: "-2%" },
          { label: "Total Requests", val: `${routeData?.totalRequests}`, icon: <ShieldAlert size={16} className="text-rose-500"/>, trend: "-2%" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-white/5 rounded-lg">{stat.icon}</div>
              <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{stat.label}</p>
            <p className="text-2xl font-mono font-bold text-white tracking-tighter">{stat.val} {stat.unit?stat.unit:""}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
      <LatencyChartCard data={chartdata} error={charterror} loading={chartloading}/>
      <RequestChartCard data={chartdata} error={charterror} loading={chartloading}/>
      <ErrorChartCard data={chartdata} error={charterror} loading={chartloading}/>
      </div>
      {/* 3. Main Charts Area */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Latency Over Time (Placeholder for Chart.js/Recharts) */}
        <div className="col-span-12 lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 size={16} className="text-violet-400" /> Latency & Load Performance
            </h3>
          </div>
          <div className="h-64 w-full flex items-end gap-2 px-2">
            {/* Simple Visual Representation of a Chart */}
            {DUMMY_HISTORY.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-help">
                <div className="relative w-full flex flex-col justify-end h-48 bg-white/5 rounded-t-sm">
                   <div className="w-full bg-violet-500/40 rounded-t-sm transition-all group-hover:bg-violet-500/60" style={{ height: `${(d.p95/500)*100}%` }} />
                </div>
                <span className="text-[10px] font-mono text-zinc-600">{d.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Code Breakdown */}
        <div className="col-span-12 lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-6">Status Distribution</h3>
          <div className="space-y-4">
            {routeData?.statusInfo?.map((s) => (
              <div >
                <div className="flex justify-between text-[11px] mb-1.5 font-mono">
                  <span className="text-zinc-300">{s.status}</span>
                  <span className="text-zinc-500">{s.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;