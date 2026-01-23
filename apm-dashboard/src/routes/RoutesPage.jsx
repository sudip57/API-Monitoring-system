import React from 'react';
import { 
  ArrowLeft, Search, Filter, Activity, 
  BarChart3, Clock, AlertCircle, ChevronRight,
  Code2, Link as LinkIcon
} from 'lucide-react';

// Hardcoded Route Data
const ROUTES = [
  { path: "/api/v1/auth/login", method: "POST", latency: 120, p95: 450, rps: 45, errors: 0.2, status: "Healthy" },
  { path: "/api/v1/user/profile", method: "GET", latency: 45, p95: 80, rps: 1200, errors: 0.01, status: "Healthy" },
  { path: "/api/v1/payments/checkout", method: "POST", latency: 850, p95: 2400, rps: 12, errors: 4.5, status: "Critical" },
  { path: "/api/v1/products/search", method: "GET", latency: 320, p95: 560, rps: 85, errors: 0.5, status: "Degraded" },
];

const RoutesPage = () => {
  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 p-8">
      
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
        <span className="hover:text-white cursor-pointer transition-colors">Services</span>
        <ChevronRight size={12} />
        <span className="hover:text-white cursor-pointer transition-colors">auth-gateway</span>
        <ChevronRight size={12} />
        <span className="text-violet-400">Endpoints</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-violet-600/10 rounded-2xl border border-violet-500/20">
            <LinkIcon size={24} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Endpoint Performance</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Analysis of all HTTP routes for <span className="text-zinc-300">auth-gateway</span></p>
          </div>
        </div>

        <div className="flex bg-white/[0.03] border border-white/10 rounded-xl p-1">
           <button className="px-4 py-2 text-xs font-bold uppercase rounded-lg bg-violet-600 text-white shadow-lg shadow-violet-600/20 transition-all">HTTP</button>
           <button className="px-4 py-2 text-xs font-bold uppercase rounded-lg text-zinc-500 hover:text-zinc-300">gRPC</button>
           <button className="px-4 py-2 text-xs font-bold uppercase rounded-lg text-zinc-500 hover:text-zinc-300">Worker</button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Slowest Endpoint</p>
            <h4 className="text-white font-mono text-sm truncate mb-1">/payments/checkout</h4>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-bold text-rose-400">850ms</span>
               <span className="text-xs text-zinc-500 font-mono">avg</span>
            </div>
         </div>
         {/* Add more metric cards here if needed */}
      </div>

      {/* Route List Table */}
      <div className="bg-[#0c0c12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-black text-zinc-500 tracking-widest">
              <th className="px-6 py-4">Method / Route Path</th>
              <th className="px-6 py-4 text-right">Throughput</th>
              <th className="px-6 py-4 text-right">Avg Latency</th>
              <th className="px-6 py-4 text-right">P95 Burst</th>
              <th className="px-6 py-4 text-right">Error %</th>
              <th className="px-6 py-4 text-center">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {ROUTES.map((route, i) => (
              <tr key={i} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black border
                      ${route.method === 'POST' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}
                    `}>{route.method}</span>
                    <span className="text-sm font-mono text-zinc-200 group-hover:text-violet-400 transition-colors">{route.path}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-xs text-white">
                  {route.rps >= 1000 ? `${(route.rps/1000).toFixed(1)}k` : route.rps} <span className="text-zinc-600 text-[10px]">rps</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-mono text-xs font-bold ${route.latency > 500 ? 'text-rose-400' : 'text-zinc-200'}`}>
                    {route.latency}ms
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-xs text-zinc-400">
                  {route.p95}ms
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={`text-xs font-mono font-bold ${route.errors > 1 ? 'text-rose-400' : 'text-zinc-500'}`}>
                    {route.errors}%
                  </div>
                </td>
                <td className="px-6 py-4">
                  {/* Placeholder for a sparkline chart */}
                  <div className="flex justify-center h-6 w-16 mx-auto bg-white/[0.02] rounded border border-white/5" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoutesPage;