import { Activity, ArrowUpRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRouteData } from "../../../services/useRouteData";
import { useAppContext } from "../../../context/GlobalAppContext";
const RouteDetailsSection = ({ serviceName }) => {
  const navigate = useNavigate();
  const { timeRange } = useAppContext();
  const { data, loading, error } = useRouteData({
      timeRange: timeRange.rangeMinutes,serviceName:serviceName
    });
  const routeData=data?.routeData;
  console.log("routedata-----",data)
  const getMethodColor = (method) => {
    const colors = {
      GET: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
      POST: "text-blue-400 bg-blue-400/10 border-blue-500/20",
      PUT: "text-amber-400 bg-amber-400/10 border-amber-500/20",
      DELETE: "text-rose-400 bg-rose-400/10 border-rose-500/20",
    };
    return colors[method] || "text-zinc-400 bg-zinc-400/10 border-white/10";
  };

  // Logic for dynamic latency coloring
  const getLatencyColor = (p95) => {
    const val = parseFloat(p95);
    if (val > 800) return "text-rose-500"; // Critical
    if (val > 400) return "text-amber-400"; // Warning
    return "text-emerald-400"; // Healthy
  };

  return (
    <div className="bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Section */}
      <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-lg ring-1 ring-violet-500/20">
            <Activity size={18} className="text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-tight">
              Route Performance
            </h3>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
              Live Monitoring • {serviceName}
            </p>
          </div>
        </div>

        <button className="group flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-violet-400 transition-colors uppercase tracking-widest">
          Full Analytics
          <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5 bg-white/[0.01]">
        <div className="col-span-4">Endpoint</div>
        <div className="col-span-2 text-center">Throughput</div>
        <div className="col-span-4 text-center">Latency (P95 / Avg)</div>
        <div className="col-span-2 text-right">Errors</div>
      </div>

      {/* Route Rows */}
      <div className="p-2 space-y-1">
        {routeData?.map((r, i) => {
          const isErrorHigh = parseFloat(r.errorRate) > 2;
          return (
            <div
              onClick={()=>navigate(`/services/${serviceName}/routes?routeName=${r.routeName}`)}
              key={i}
              className="grid grid-cols-12 items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 group cursor-pointer"
            >
              {/* Endpoint info */}
              <div className="col-span-4 flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${getMethodColor(r.methodName)}`}>
                  {r.methodName}
                </span>
                <span className="text-sm font-mono text-zinc-300 truncate group-hover:text-white transition-colors tracking-tight">
                  {r.routeName}
                </span>
              </div>

              {/* Throughput Metric */}
              <div className="col-span-2 flex flex-col items-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-mono font-bold text-zinc-100">{r.throughPut}</span>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase">rps</span>
                </div>
              </div>

              {/* Latency Metrics with Dynamic Color */}
              <div className="col-span-4 flex items-center justify-center gap-2">
                <span className={`text-sm font-mono font-bold transition-colors duration-500 ${getLatencyColor(r.p95Latency)}`}>
                  {r.p95Latency}
                </span>
                <span className="text-[10px] text-zinc-700 font-bold">/</span>
                <span className="text-xs font-mono text-zinc-500">
                  {r.avgLatency}
                </span>
              </div>

              {/* Error Rate & Status Icon */}
              <div className="col-span-2 flex items-center justify-end gap-3 text-right">
                <span className={`text-xs font-mono font-bold ${isErrorHigh ? "text-rose-500" : "text-emerald-500/80"}`}>
                  {r.errorRate}%
                </span>
                {isErrorHigh ? (
                  <AlertCircle size={14} className="text-rose-500 animate-pulse" />
                ) : (
                  <CheckCircle2 size={14} className="text-emerald-500/40" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RouteDetailsSection;