import React from 'react';
import { useState } from 'react';
import { 
  ArrowLeft, Search, Filter, Activity, 
  BarChart3, Clock, AlertCircle, ChevronRight,
  Code2, Link as LinkIcon, RefreshCw
} from 'lucide-react';
import { useAppContext } from '../context/GlobalAppContext';
import { useRouteData } from '../services/useRouteData';

const RoutesPage = () => {
  const { timeRange } = useAppContext();
  const { data, loading, error } = useRouteData(timeRange.rangeMinutes);
  const [selectedMethod, setSelectedMethod] = useState('all');
  
  const routes = data?.routeData || [];
  const filteredRoutes = selectedMethod === 'all' ? routes : routes.filter(r => r.methodName === selectedMethod);
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  
  if (error) {
    return (
      <div className="min-h-screen bg-[#050508] text-zinc-300 p-8">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
        <h3 className="text-white font-semibold mb-1">Error Loading Routes</h3>
        <p className="text-zinc-500 text-xs">Failed to fetch route data</p>
      </div>
    );
  }
  
  const slowestRoute = filteredRoutes.length > 0 
    ? filteredRoutes.reduce((max, r) => r.avgLatency > max.avgLatency ? r : max)
    : null;
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
            <h4 className="text-white font-mono text-sm truncate mb-1">{slowestRoute?.routeName || 'N/A'}</h4>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-bold text-rose-400">{slowestRoute?.avgLatency || 0}ms</span>
               <span className="text-xs text-zinc-500 font-mono">avg</span>
            </div>
         </div>
         <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Total Routes</p>
            <h4 className="text-white font-mono text-sm truncate mb-1">{filteredRoutes.length}</h4>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-bold text-emerald-400">{filteredRoutes.length}</span>
               <span className="text-xs text-zinc-500 font-mono">endpoints</span>
            </div>
         </div>
         <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Avg Error Rate</p>
            <h4 className="text-white font-mono text-sm truncate mb-1">{(filteredRoutes.reduce((sum, r) => sum + r.errorRate, 0) / (filteredRoutes.length || 1)).toFixed(2)}%</h4>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-bold text-blue-400">{(filteredRoutes.reduce((sum, r) => sum + r.errorRate, 0) / (filteredRoutes.length || 1)).toFixed(2)}%</span>
               <span className="text-xs text-zinc-500 font-mono">across all</span>
            </div>
         </div>
      </div>

      {/* Method Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button 
          onClick={() => setSelectedMethod('all')}
          className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
            selectedMethod === 'all' 
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
              : 'bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          All Methods
        </button>
        {methods.map(method => (
          <button 
            key={method}
            onClick={() => setSelectedMethod(method)}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
              selectedMethod === method 
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                : 'bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {method}
          </button>
        ))}
      </div>

      {/* Route List Table */}
      <div className="bg-[#0c0c12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        {loading && (
          <div className="flex items-center justify-center h-96">
            <RefreshCw size={24} className="animate-spin text-violet-500" />
          </div>
        )}
        {!loading && filteredRoutes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96">
            <AlertCircle className="text-zinc-500 mb-4" size={40} />
            <p className="text-zinc-500">No routes found</p>
          </div>
        )}
        {!loading && filteredRoutes.length > 0 && (
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-black text-zinc-500 tracking-widest">
              <th className="px-6 py-4">Method / Route Path</th>
              <th className="px-6 py-4 text-right">Total Requests</th>
              <th className="px-6 py-4 text-right">Avg Latency</th>
              <th className="px-6 py-4 text-right">P95 Burst</th>
              <th className="px-6 py-4 text-right">Error %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filteredRoutes.map((route, i) => (
              <tr key={i} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black border
                      ${route.methodName === 'POST' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 
                        route.methodName === 'GET' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        route.methodName === 'PUT' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        route.methodName === 'DELETE' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                        'bg-purple-500/10 border-purple-500/20 text-purple-400'}
                    `}>{route.methodName}</span>
                    <span className="text-sm font-mono text-zinc-200 group-hover:text-violet-400 transition-colors">{route.routeName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-xs text-white">
                  {route.totalRequests}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-mono text-xs font-bold ${route.avgLatency > 500 ? 'text-rose-400' : 'text-zinc-200'}`}>
                    {route.avgLatency}ms
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-xs text-zinc-400">
                  {route.p95Latency}ms
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={`text-xs font-mono font-bold ${route.errorRate > 1 ? 'text-rose-400' : 'text-zinc-500'}`}>
                    {route.errorRate}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}

export default RoutesPage;