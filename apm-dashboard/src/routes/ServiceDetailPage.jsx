import React from 'react';
import { useParams } from "react-router-dom";
import { useAppContext } from '../context/GlobalAppContext';
import { 
  Activity, ShieldCheck, Zap, Box, 
  Clock, HardDrive, Share2, AlertTriangle,
  ArrowUpRight, Globe, Layers
} from 'lucide-react';
import TimeRangePicker from '../components/ui/TimeRangePicker';

const SERVICE_META = {
  name: "auth-gateway-production",
  environment: "Production",
  version: "v2.4.12",
  language: "Node.js 20.x",
  region: "us-east-1",
  status: "Healthy",
  uptime: "99.98%"
};
const options = [
    { label: "Last 15 minutes", value: 15 },
    { label: "Last 60 minutes", value: 60 },
    { label: "Last 24 hours", value: 1440 },
  ];
const ServiceDetailPage = () => {
    const {timeRange} = useAppContext()
   const handleRefresh = (minutes) => {
    const now = Date.now();
    const from = now - minutes * 60 * 1000;
    
    timeRange.setRangeMinutes(minutes);
    timeRange.setRange({ from, to: now });
    };
  const { serviceName } = useParams();
  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 p-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <Box className="text-violet-400" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{serviceName}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest">
                {SERVICE_META.status}
              </span>
            </div>
            <p className="text-zinc-500 text-sm mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Globe size={14}/> {SERVICE_META.region}</span>
              <span className="flex items-center gap-1.5"><Layers size={14}/> {SERVICE_META.version}</span>
              <span className="flex items-center gap-1.5 text-violet-400/80"><Clock size={14}/> Uptime: {SERVICE_META.uptime}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TimeRangePicker/>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Avg Latency', val: '42ms', change: '-4%', icon: Zap, color: 'text-amber-400' },
          { label: 'Throughput', val: '1.2k rps', change: '+12%', icon: Activity, color: 'text-violet-400' },
          { label: 'Error Rate', val: '0.02%', change: '0%', icon: ShieldCheck, color: 'text-emerald-400' },
          { label: 'Active Instances', val: '12/12', change: 'Stable', icon: HardDrive, color: 'text-blue-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0c0c12] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg bg-white/[0.03] ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <span className={`text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">{stat.val}</div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 3. Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Charts & Logs placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-6 flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Service Topology</h3>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            
            {/* Contextual Placeholder for Traffic Flow Visual */}
            <div className="text-center space-y-3 opacity-40 group hover:opacity-100 transition-opacity">
               <div className="p-4 bg-white/[0.02] border border-dashed border-white/10 rounded-full inline-block">
                 <Share2 size={48} className="text-zinc-600 group-hover:text-violet-500 transition-colors" />
               </div>
               <p className="text-sm font-medium">Visualizing Inbound/Outbound Dependencies...</p>
            </div>
          </div>

          <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                 <AlertTriangle size={16} className="text-amber-500" />
                 Recent Anomalies
               </h3>
               <button className="text-xs text-violet-400 font-bold hover:underline">Full Log Report</button>
            </div>
            
            {/* Hardcoded Log Samples */}
            <div className="space-y-3">
              {[
                { time: '14:22:01', msg: 'DNS Resolution Timeout on external API: Stripe', level: 'Warning' },
                { time: '14:18:55', msg: 'Memory usage exceeded 85% threshold on node-04', level: 'Critical' },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono">
                  <span className="text-zinc-600">{log.time}</span>
                  <span className={log.level === 'Critical' ? 'text-rose-500' : 'text-amber-500'}>[{log.level}]</span>
                  <span className="text-zinc-400">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Infrastructure & Metadata */}
        <div className="space-y-6">
          <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Infrastructure</h3>
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
            <h3 className="text-xs font-black text-violet-400 uppercase tracking-[0.2em] mb-4">Metadata Summary</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Stack</p>
                <p className="text-xs text-white font-semibold">{SERVICE_META.language}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Env</p>
                <p className="text-xs text-white font-semibold">{SERVICE_META.environment}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Instances</p>
                <p className="text-xs text-white font-semibold">K8s Pods (12)</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Owner</p>
                <p className="text-xs text-white font-semibold">@platform-team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;