import React, { useState, useEffect } from "react";
import { useServiceOverview } from '../../../services/useServiceOverview'
import { Server, Activity, AlertCircle, ChevronRight, RefreshCw } from "lucide-react";

const ServiceTable = () => {
  const LOOKBACK_MS = 30 * 60 * 1000;
  const REFRESH_INTERVAL_MS = 10000; 
  const [localRange, setLocalRange] = useState({
    from: Date.now() - LOOKBACK_MS,
    to: Date.now()
  });
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setLocalRange({
        from: now - LOOKBACK_MS,
        to: now
      });
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);
  const { data, loading, error } = useServiceOverview(localRange.from, localRange.to);

  if (loading && !data) {
    return (
      <div className="w-full h-64 rounded-xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center">
        <div className="text-zinc-500 text-xs tracking-widest uppercase flex items-center gap-2">
          <RefreshCw size={14} className="animate-spin" />
          Analyzing Services...
        </div>
      </div>
    );
  }

  if (error || !data || !data.services || data.services.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0f0f15] p-10 text-center">
        <AlertCircle className="mx-auto text-zinc-600 mb-3" size={32} />
        <div className="text-zinc-400 text-sm">No service data available for this range</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#0f0f15] shadow-2xl overflow-hidden relative w-full">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-[50px] pointer-events-none" />

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Server size={16} className="text-violet-400" />
            Service Registry
            {loading && <RefreshCw size={12} className="animate-spin text-violet-500/50" />}
          </h2>
          <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-wider font-medium">
            Live Health Metrics • {data.services.length} Total
          </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Live</span>
            </div>
            <button className="text-[11px] text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                View All
            </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-widest text-zinc-500 bg-white/[0.02]">
              <th className="px-6 py-4 font-bold">Service Name</th>
              <th className="px-6 py-4 text-right font-bold">Avg Latency</th>
              <th className="px-6 py-4 text-right font-bold">p95 Latency</th>
              <th className="px-6 py-4 text-right font-bold">Error Rate</th>
              <th className="px-6 py-4 text-center font-bold">Status</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {data.services.map((svc) => (
              <tr
                key={svc.serviceName}
                className="group hover:bg-white/[0.03] transition-all duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-violet-500/40 transition-colors">
                      <Activity size={14} className="text-zinc-500 group-hover:text-violet-400" />
                    </div>
                    <span className="text-zinc-100 font-semibold tracking-tight">
                      {svc.serviceName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-zinc-300 font-mono text-xs">{svc.avgLatency}ms</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-zinc-300 font-mono text-xs">{svc.p95Latency}ms</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-xs font-mono font-medium ${parseFloat(svc.errorRate) > 1 ? 'text-rose-400' : 'text-zinc-400'}`}>
                    {svc.errorRate}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border backdrop-blur-md
                        ${svc.status.label.toLowerCase() === 'healthy' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                      <span className={`w-1 h-1 rounded-full animate-pulse ${svc.status.label.toLowerCase() === 'healthy' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      {svc.status.label}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight size={14} className="text-zinc-700 group-hover:text-violet-400 transition-colors transform group-hover:translate-x-1" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
         <span className="text-[10px] text-zinc-600 font-medium">
            Next sync in sync with health monitor
         </span>
         <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">
            Last update: {new Date().toLocaleTimeString()}
         </span>
      </div>
    </div>
  );
};

export default ServiceTable;