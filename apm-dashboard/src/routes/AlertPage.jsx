import React from 'react';
import { 
  Bell, BellOff, AlertTriangle, ShieldAlert, 
  Settings, Plus, Search, Filter, 
  ChevronRight, MoreVertical, CheckCircle2, Clock
} from 'lucide-react';

// Hardcoded Alert Data
const ACTIVE_INCIDENTS = [
  { id: "inc_01", title: "High Error Rate - auth-gateway", severity: "Critical", duration: "12m", service: "auth-gateway", condition: "Error Rate > 5%", status: "Triggered" },
  { id: "inc_02", title: "Latency Spike - payment-processor", severity: "Warning", duration: "45m", service: "payment-processor", condition: "p95 Latency > 2s", status: "Acknowledged" },
  { id: "inc_03", title: "Disk Space Low - inventory-db", severity: "Warning", duration: "2h", service: "inventory-db", condition: "Storage > 85%", status: "Triggered" },
];

const AlertPage = () => {
  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 p-8">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <Bell size={24} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Alert Center</h1>
            <p className="text-zinc-500 text-sm mt-0.5 uppercase tracking-widest font-bold">Incidents & Notification Rules</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs font-bold uppercase hover:bg-white/[0.08] transition-all">
            <Settings size={16} /> Notification Channels
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-lg shadow-violet-600/20">
            <Plus size={16} /> Create Alert Rule
          </button>
        </div>
      </div>

      {/* 2. Global Alert Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <MetricBox label="Critical" value="1" color="text-rose-500" bg="bg-rose-500/5" border="border-rose-500/20" />
         <MetricBox label="Warning" value="2" color="text-amber-500" bg="bg-amber-500/5" border="border-amber-500/20" />
         <MetricBox label="Acknowledged" value="1" color="text-blue-500" bg="bg-blue-500/5" border="border-blue-500/20" />
         <MetricBox label="Active Rules" value="24" color="text-zinc-400" bg="bg-white/5" border="border-white/10" />
      </div>

      {/* 3. Incidents Table */}
      <div className="relative w-full rounded-2xl bg-[#0c0c12] border border-white/10 shadow-2xl overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none" />
        
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-500" />
            Active Incidents
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
              <input type="text" placeholder="Filter incidents..." className="bg-transparent border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500/50 w-48" />
            </div>
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all"><Filter size={14}/></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 bg-white/[0.02]">
                <th className="px-6 py-4 font-black">Incident Detail</th>
                <th className="px-6 py-4 font-black">Service</th>
                <th className="px-6 py-4 font-black text-center">Duration</th>
                <th className="px-6 py-4 font-black text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {ACTIVE_INCIDENTS.map((incident) => (
                <tr key={incident.id} className="group hover:bg-white/[0.03] transition-all cursor-pointer">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                       <div className={`p-2.5 rounded-xl border ${incident.severity === 'Critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                          <AlertTriangle size={18} className={incident.severity === 'Critical' ? 'animate-pulse' : ''} />
                       </div>
                       <div>
                          <div className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">
                            {incident.title}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-medium uppercase mt-0.5">
                            {incident.condition}
                          </div>
                       </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-xs font-mono text-violet-400 bg-violet-400/5 px-2 py-1 rounded border border-violet-400/10">
                      {incident.service}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-medium">
                       <Clock size={12} /> {incident.duration}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                       <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                         ${incident.status === 'Triggered' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}
                       `}>
                         <div className={`w-1 h-1 rounded-full ${incident.status === 'Triggered' ? 'bg-rose-400 animate-ping' : 'bg-blue-400'}`} />
                         {incident.status}
                       </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all" title="Acknowledge">
                          <CheckCircle2 size={16} />
                       </button>
                       <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
                          <MoreVertical size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Metric Component
const MetricBox = ({ label, value, color, bg, border }) => (
  <div className={`p-5 rounded-2xl border ${bg} ${border} flex flex-col items-center justify-center transition-all hover:scale-[1.02]`}>
     <span className={`text-2xl font-black ${color}`}>{value}</span>
     <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mt-1">{label}</span>
  </div>
);

export default AlertPage;