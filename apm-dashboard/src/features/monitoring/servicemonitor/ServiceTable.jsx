import { useState, useEffect } from "react";
import { useServiceData } from '../../../services/useServiceData'
import { Server, Activity, AlertCircle, RefreshCw, ArrowUpRight } from "lucide-react";
import { useAppContext } from "../../../context/GlobalAppContext";

const ServiceTable = () => {
  const { timeRange } = useAppContext();
  const { data, loading, error } = useServiceData(timeRange.rangeMinutes);
  
  if (loading && !data) {
    return (
      <div className="w-full h-80 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse flex flex-col items-center justify-center gap-4">
        <RefreshCw size={24} className="animate-spin text-violet-500/40" />
        <div className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-bold">
          Mapping Service Topology
        </div>
      </div>
    );
  }

  if (error || !data || !data.servicesData || data.servicesData.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0c0c12] p-12 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />
        <AlertCircle className="mx-auto text-red-500/40 mb-4" size={40} />
        <h3 className="text-white font-semibold mb-1">No Telemetry Detected</h3>
        <p className="text-zinc-500 metric-xs text-center max-w-xs mx-auto">Check your service connection or adjust the time range to see active services.</p>
      </div>
    );
  }

  return (
    <div className="group relative md:w-[60%] rounded-2xl bg-[#0c0c12] border border-white/10 shadow-2xl overflow-hidden transition-all hover:border-white/20 ">
      
      {/* Refractive Glass Light Effect */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01] relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-violet-500/10 rounded-xl border border-violet-500/20 shadow-inner">
            <Server size={20} className="text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Service Registry
              {loading && <RefreshCw size={12} className="animate-spin text-violet-400/50" />}
            </h3>
            <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-widest font-bold">
              {data.servicesData.length} Nodes Active
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all font-bold uppercase tracking-tighter">
          Full Metrics <ArrowUpRight size={12} />
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className=" bg-white/[0.02]">
              <th className="px-6 py-4 metric-label  border-b border-white/5">Service Identity</th>
              <th className="px-6 py-4 metric-label  border-b border-white/5">Status</th>
              <th className="px-6 py-4 metric-label  border-b border-white/5">Avg Latency</th>
              <th className="px-6 py-4 metric-label  border-b border-white/5">P95 Burst</th>
              <th className="px-6 py-4 metric-label  border-b border-white/5">Error Rate</th>
              <th className="px-6 py-4 metric-label text-center  border-b border-white/5">Health</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.03]">
            {data.servicesData.map((svc) => (
              <tr
                key={svc.serviceName}
                className="group/row hover:bg-white/[0.03] transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover/row:border-violet-500/30 group-hover/row:bg-violet-500/[0.02] transition-all">
                      <Activity size={16} className="text-zinc-600 group-hover/row:text-violet-400 transition-colors" />
                    </div>
                    <div>
                      <div className="text-zinc-100 font-bold tracking-tight text-sm">
                        {svc.serviceName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                 <div className="flex justify-center items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        svc.serviceStatus === "up"
                          ? "bg-emerald-400"
                          : "bg-rose-400"
                      }`}
                    />

                    <span
                      className={`text-[11px] font-medium ${
                        svc.serviceStatus === "up"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {svc.serviceStatus === "up" ? "Up" : "Down"}
                    </span>
                  </div>
                </td>
                {svc.stats=="no traffic"?(
                    <td colSpan={4} className="px-6 py-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-zinc-500">
                        <span className="text-sm font-medium tracking-wide">
                          No traffic yet
                        </span>
                        <span className="text-xs text-zinc-600">
                          (Waiting for requests)
                        </span>
                      </div>
                    </td>
              ):(
                <>
                <td className="px-6 py-4 text-right">
                  <div className="text-zinc-100 font-mono metric-xs text-center font-semibold">{svc.stats.avgLatency}ms</div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="text-zinc-100 font-mono metric-xs text-center font-semibold">{svc.stats.p95Latency}ms</div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className={`metric-xs text-center font-mono font-bold ${parseFloat(svc.stats.errorRate) > 1 ? 'text-rose-400' : 'text-zinc-300'}`}>
                    {svc.stats.errorRate}%
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300
                        ${svc.stats.healthStatus?.toLowerCase() === 'healthy' 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]' 
                          : 'bg-rose-500/5 border-rose-500/20 text-rose-400 shadow-[0_0_15px_-5px_rgba(244,63,94,0.3)]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${svc.stats.healthStatus?.toLowerCase() === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                      {svc.stats.healthStatus}
                    </span>
                  </div>
                </td>
                </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceTable;