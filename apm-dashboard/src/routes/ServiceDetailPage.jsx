import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/GlobalAppContext";
import { useLiveMetrics } from "../services/useLiveMetrics";
import {
  Activity,
  ShieldCheck,
  Zap,
  Box,
  Clock,
  HardDrive,
  Share2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Globe,
  Layers,
  RefreshCw,
} from "lucide-react";
import TimeRangePicker from "../components/ui/TimeRangePicker";
function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  return [
    hrs.toString().padStart(2, "0") + "h",
    +min.toString().padStart(2, "0") + "m",
  ].join(" : ");
}
function findTrendValue(oldVal, newVal) {
  const oldRate = Number(oldVal);
  const newRate = Number(newVal);
  if (!oldRate || isNaN(oldRate) || isNaN(newRate)) return "0.00";
  const jump = ((newRate - oldRate) / oldRate) * 100;
  return (jump > 0 ? "+" : "") + jump.toFixed(2);
}

const SERVICE_META = {
  name: "auth-gateway-production",
  environment: "Production",
  version: "v2.4.12",
  language: "Node.js 20.x",
  region: "us-east-1",
  status: "Healthy",
  uptime: "99.98%",
};
const ServiceDetailPage = () => {
  const { serviceName } = useParams();
  const { timeRange } = useAppContext();
  const [serviceData, setserviceData] = useState(null);
  const { latest, series } = useLiveMetrics({ projectkey: "test-project" });
  const [trend, setTrend] = useState({
    latency: 0,
    errorRate: 0,
    rps: 0,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api-monitoring-system-szih.onrender.com/ranged/metrics/serviceData?timeRange=2&serviceName=${serviceName}`,
        );

        const data = await res.json();
        const newData = data.servicesData[0];

        setserviceData((prev) => {
          if (prev) {
            setTrend({
              latency: findTrendValue(
                prev.stats.avgLatency,
                newData.stats.avgLatency,
              ),
              errorRate: findTrendValue(
                prev.stats.errorRate,
                newData.stats.errorRate,
              ),
              rps: findTrendValue(
                prev.stats.avgThroughPut,
                newData.stats.avgThroughPut,
              ),
            });
          }

          return newData;
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, [serviceName]);

  const handleRefresh = (minutes) => {
    const now = Date.now();
    const from = now - minutes * 60 * 1000;
    timeRange.setRangeMinutes(minutes);
    timeRange.setRange({ from, to: now });
  };
  console.log("-------", serviceData);
  if (!serviceData) {
    return (
      <div className="w-full h-80 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse flex flex-col items-center justify-center gap-4">
        <RefreshCw size={24} className="animate-spin text-violet-500/40" />
        <div className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-bold">
          Mapping Service Topology
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 p-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <Box className="text-violet-400" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className=" text-white tracking-tight">{serviceName}</h1>
              <span
                className={`px-2 py-0.5 rounded text-sm font-bold bg-emerald-500/10 border ${!serviceData.stats?"invisible":"visible"} ${
                  serviceData.stats.healthStatus?.toLowerCase() === "healthy"
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]"
                    : "bg-rose-500/5 border-rose-500/20 text-rose-400 shadow-[0_0_15px_-5px_rgba(244,63,94,0.3) ]"
                } tracking-widest`}
              >
                {serviceData.stats.healthStatus}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-sm font-bold uppercase bg-emerald-500/10 border ${!serviceData?"invisible":"visible"} ${
                  serviceData.serviceStatus === "up"
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]"
                    : "bg-rose-500/5 border-rose-500/20 text-rose-400 shadow-[0_0_15px_-5px_rgba(244,63,94,0.3) ]"
                } tracking-widest`}
              >
                {serviceData.serviceStatus}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-violet-400/80">
              <Clock size={14} /> Uptime: {formatUptime(serviceData.upTime)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <TimeRangePicker />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Avg Latency",
            val: `${!serviceData.stats?"----":serviceData.stats.avgLatency}`,
            change: `${trend.latency}%`,
            icon: Zap,
            color: "text-amber-400",
          },
          {
            label: "Throughput",
            val: `${!serviceData.stats?"----":serviceData.stats.avgThroughPut}`,
            change: `${trend.rps}%`,
            icon: Activity,
            color: "text-violet-400",
          },
          {
            label: "Error Rate",
            val: `${!serviceData.stats?"----":serviceData.stats.errorRate}`,
            change: `${trend.errorRate}%`,
            icon: ShieldCheck,
            color: "text-emerald-400",
          },
          {
            label: "Active Instances",
            val: "12/12",
            change: "Stable",
            icon: HardDrive,
            color: "text-blue-400",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#0c0c12] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg bg-white/[0.03] ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <span
                className={`text-[10px] font-bold ${stat.change.startsWith("+") ? "text-rose-400" : "text-emerald-400"}`}
              >
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {stat.val}
            </div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Charts & Logs placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-6 flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Service Topology
              </h3>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Contextual Placeholder for Traffic Flow Visual */}
            <div className="text-center space-y-3 opacity-40 group hover:opacity-100 transition-opacity">
              <div className="p-4 bg-white/[0.02] border border-dashed border-white/10 rounded-full inline-block">
                <Share2
                  size={48}
                  className="text-zinc-600 group-hover:text-violet-500 transition-colors"
                />
              </div>
              <p className="text-sm font-medium">
                Visualizing Inbound/Outbound Dependencies...
              </p>
            </div>
          </div>

          <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                Recent Anomalies
              </h3>
              <button className="text-xs text-violet-400 font-bold hover:underline">
                Full Log Report
              </button>
            </div>

            {/* Hardcoded Log Samples */}
            <div className="space-y-3">
              {[
                {
                  time: "14:22:01",
                  msg: "DNS Resolution Timeout on external API: Stripe",
                  level: "Warning",
                },
                {
                  time: "14:18:55",
                  msg: "Memory usage exceeded 85% threshold on node-04",
                  level: "Critical",
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono"
                >
                  <span className="text-zinc-600">{log.time}</span>
                  <span
                    className={
                      log.level === "Critical"
                        ? "text-rose-500"
                        : "text-amber-500"
                    }
                  >
                    [{log.level}]
                  </span>
                  <span className="text-zinc-400">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Infrastructure & Metadata */}
        <div className="space-y-6">
          <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">
              Infrastructure
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-zinc-400">Memory Allocation</span>
                  <span className="text-white font-mono">2.4GB / 4.0GB</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full w-[60%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-zinc-400">CPU Load (Aggregate)</span>
                  <span className="text-white font-mono">14%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[14%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-600/10 to-transparent border border-violet-500/20 rounded-2xl p-6">
            <h3 className="text-xs font-black text-violet-400 uppercase tracking-[0.2em] mb-4">
              Metadata Summary
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                  Stack
                </p>
                <p className="text-xs text-white font-semibold">
                  {SERVICE_META.language}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                  Env
                </p>
                <p className="text-xs text-white font-semibold">
                  {SERVICE_META.environment}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                  Instances
                </p>
                <p className="text-xs text-white font-semibold">
                  K8s Pods (12)
                </p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                  Owner
                </p>
                <p className="text-xs text-white font-semibold">
                  @platform-team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
