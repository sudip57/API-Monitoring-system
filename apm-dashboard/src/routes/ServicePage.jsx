import {useState} from 'react';
import { useAppContext } from '../context/GlobalAppContext';
import { useServiceOverview } from '../services/useServiceOverview';
import TimeRangePicker from '../components/ui/TimeRangePicker';
import { useNavigate, useLocation } from "react-router-dom";
import { useLiveMetrics } from '../features/monitoring/hooks/useLiveMetrics';
import { 
  Server, Search, Filter, Activity, 
  ChevronRight, ArrowUpRight, Plus, 
  Zap, ShieldAlert, Globe, Cpu ,RefreshCw,
} from 'lucide-react';


const ServicePage = () => {
    const { timeRange } = useAppContext();
    const { data, loading, error } = useServiceOverview(timeRange.from, timeRange.to);
    const { latest, series } = useLiveMetrics({projectkey:"test-project"});
    console.log(latest);
    const navigate = useNavigate();
    const handleClick  = (serviceName)=>{

        navigate(`/services/${serviceName}`);
    }
    console.log(data)
    if (loading && !data) {
    return (
      <div className="w-full h-80 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse flex flex-col items-center justify-center gap-4">
        <div className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-bold">
          Mapping Service Topology
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 p-8 font-sans">
      
      {/* Header & Global Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Service Directory</h1>
          <p className="text-zinc-500 mt-2 flex items-center gap-2">
            Monitoring <span className="text-violet-400 font-bold">{data.services.length}</span> active services
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, team, or tag..." 
              className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
            />
          </div>
          <TimeRangePicker/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.services.map((svc) => (
          <div 
            key={svc.serviceName} 
            className="group relative bg-[#0c0c12] border border-white/10 rounded-2xl p-6 hover:border-violet-500/40 hover:bg-[#11111a] transition-all cursor-pointer shadow-xl overflow-hidden"
          >
            {/* Health Glow Effect */}
            <div className={`absolute -top-12 -right-12 w-24 h-24 blur-[60px] opacity-20 pointer-events-none transition-colors
              ${svc.status.label === 'Healthy' ? 'bg-emerald-500' : svc.status.label === 'Degraded' ? 'bg-amber-500' : 'bg-rose-500'}
            `} />

            {/* Card Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border transition-colors
                  ${svc.status.label === 'Healthy' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 
                    svc.status.label === 'Degraded' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' : 
                    'bg-rose-500/5 border-rose-500/20 text-rose-400'}
                `}>
                  <Server size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-tight group-hover:text-violet-400 transition-colors">{svc.serviceName}</h3>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 mb-6 border-y border-white/5 py-4">
              <div className="text-center border-r border-white/5">
                <p className="text-[9px] text-zinc-600 uppercase font-black mb-1">Latency</p>
                <p className="text-sm font-mono text-white font-bold">{svc.avgLatency}ms</p>
              </div>
              <div className="text-center border-r border-white/5">
                <p className="text-[9px] text-zinc-600 uppercase font-black mb-1">Errors</p>
                <p className={`text-sm font-mono font-bold ${svc.errorRate > 1 ? 'text-rose-400' : 'text-white'}`}>{svc.errorRate}%</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-zinc-600 uppercase font-black mb-1">Traffic</p>
                <p className="text-sm font-mono text-white font-bold">{svc.avgThroughputRPS >= 1000 ? `${(svc.avgThroughputRPS/1000).toFixed(1)}k` : svc.avgThroughputRPS}</p>
              </div>
            </div>

            {/* Infrastructure Details */}
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <div className="flex items-center gap-4">
                 <span className="flex items-center gap-1.5"><Cpu size={14}/> {svc.instances} Pods</span>
                 <span className="flex items-center gap-1.5 font-medium">@{svc.owner}</span>
              </div>
              <div onClick={()=>handleClick(svc.serviceName)} className="flex items-center gap-1 text-violet-400 font-bold hover:gap-2 transition-all">
                Details <ChevronRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePage;