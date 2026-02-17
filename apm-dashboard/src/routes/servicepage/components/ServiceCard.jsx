import React from 'react';
import { useNavigate } from "react-router-dom";
import {
  Server,
  Clock,
  ChevronRight,
  Activity,
  Cpu,
  ShieldAlert,
  Zap,
  MoreVertical,
  History
} from "lucide-react";

const ServiceCard = ({ svc }) => {
  const navigate = useNavigate();

  const getStatusColor = () => {
    const health = svc.stats.healthStatus.toLowerCase();
    if (health === "healthy") return { primary: "emerald", hex: "#10b981" };
    if (health === "degraded") return { primary: "amber", hex: "#f59e0b" };
    return { primary: "rose", hex: "#f43f5e" };
  };

  const status = getStatusColor();

  return (
    <div
      onClick={() => navigate(`/services/${svc.serviceName}`)}
      className="group relative bg-[#0c0c12]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 hover:bg-[#12121d] hover:border-violet-500/30 transition-all duration-500 shadow-2xl hover:shadow-violet-500/10 cursor-pointer"
    >
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-${status.primary}-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

      {/* Header Area */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          {/* Icon Container - Fixed Width */}
          <div className={`
            relative w-fit h-fit p-3 rounded-2xl bg-${status.primary}-500/10 border border-${status.primary}-500/20 text-${status.primary}-400
            shadow-[0_0_20px_rgba(0,0,0,0.2)] group-hover:scale-105 transition-transform duration-500
          `}>
            <Server size={22} />
            {/* Live Heartbeat */}
            {svc.serviceStatus.toLowerCase() === "up" && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-violet-400 transition-colors">
                {svc.serviceName}
              </h3>
              <span className="text-[10px] font-mono font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 uppercase">
                v1.0.4
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full bg-${status.primary}-500`} />
                {svc.serviceStatus.toUpperCase()}
              </span>
              <span className="text-zinc-700 font-bold">/</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{svc.stats.healthStatus}</span>
            </div>
          </div>
        </div>

        <button className="p-2 text-zinc-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: "LATENCY", val: `${svc.stats.avgLatency}ms`, icon: <Zap size={12}/>, color: "text-blue-400" },
          { label: "ERRORS", val: `${svc.stats.errorRate}%`, icon: <ShieldAlert size={12}/>, color: svc.stats.errorRate > 1 ? "text-rose-400" : "text-emerald-400" },
          { label: "TRAFFIC", val: svc.stats.avgThroughPut >= 1000 ? `${(svc.stats.avgThroughPut / 1000).toFixed(1)}k`+"rps" : svc.stats.avgThroughPut+"rps", icon: <Activity size={12}/>, color: "text-violet-400" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col items-center group/metric hover:bg-white/[0.04] transition-colors">
            <div className={`flex items-center gap-1.5 ${item.color} mb-1`}>
              {item.icon}
              <span className="text-[8px] font-black uppercase tracking-tighter opacity-70">{item.label}</span>
            </div>
            <p className="text-sm font-mono font-bold text-white leading-none tracking-tight">
              {item.val}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Infrastructure Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-4 text-zinc-500">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-tighter">
            <Cpu size={14} className="text-zinc-600" />
            <span>{svc.instances} Nodes</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-tighter">
            <History size={14} className="text-zinc-600" />
            <span>99.9% Up</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-violet-400 text-xs font-bold transition-all group-hover:gap-2">
          Analyze <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;