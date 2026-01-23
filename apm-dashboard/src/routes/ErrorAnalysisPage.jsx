import React from 'react';
import { 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  Terminal, 
  Filter, 
  Search, 
  ArrowUpRight,
  ShieldX,
  Bug,
  Activity
} from 'lucide-react';

// Hardcoded Error Group Data
const ERROR_GROUPS = [
  { 
    id: "err_01", 
    exception: "TypeError: Cannot read property 'id' of undefined", 
    service: "auth-gateway", 
    count: 1420, 
    users: 890, 
    lastSeen: "2 mins ago", 
    status: "Active",
    route: "/api/v1/user/profile"
  },
  { 
    id: "err_02", 
    exception: "SequelizeConnectionError: Connection pool full", 
    service: "payment-processor", 
    count: 85, 
    users: 42, 
    lastSeen: "12 mins ago", 
    status: "Resolved",
    route: "/api/v1/checkout"
  },
  { 
    id: "err_03", 
    exception: "Error: Third-party API Timeout (Stripe)", 
    service: "payment-processor", 
    count: 210, 
    users: 180, 
    lastSeen: "1 min ago", 
    status: "Active",
    route: "/api/v1/payments/verify"
  },
];

const ErrorAnalysisPage = () => {
  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 p-8">
      
      {/* 1. Header with Global Error Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
            <ShieldX size={24} className="text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Error Analysis</h1>
            <p className="text-zinc-500 text-sm mt-0.5 uppercase tracking-widest font-bold">Aggregate Issue Tracker</p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl">
           <div className="text-center">
              <p className="text-[10px] text-zinc-500 uppercase font-black">Total Events</p>
              <p className="text-xl font-bold text-white">12.4k</p>
           </div>
           <div className="w-px h-8 bg-white/10" />
           <div className="text-center">
              <p className="text-[10px] text-zinc-500 uppercase font-black">Affected Users</p>
              <p className="text-xl font-bold text-rose-400">1.2k</p>
           </div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by exception, message, or stack trace..." 
              className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-rose-500/40 transition-all"
            />
          </div>
          <button className="h-11 px-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-tighter">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* 3. Error Table / Grouped List */}
      <div className="group relative w-full rounded-2xl bg-[#0c0c12] border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/5 blur-[100px] pointer-events-none" />

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 bg-white/[0.02]">
                <th className="px-6 py-4 font-black">Issue / Exception</th>
                <th className="px-6 py-4 text-center font-black">Impact</th>
                <th className="px-6 py-4 text-right font-black">Last Seen</th>
                <th className="px-6 py-4 text-center font-black">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {ERROR_GROUPS.map((err) => (
                <tr key={err.id} className="group/row hover:bg-white/[0.03] transition-all cursor-pointer">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-center">
                          <Bug size={18} className="text-rose-500/60 group-hover/row:text-rose-400 transition-colors" />
                       </div>
                       <div>
                          <div className="text-sm font-mono font-bold text-zinc-200 group-hover/row:text-white transition-colors max-w-md truncate">
                            {err.exception}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                             <span className="flex items-center gap-1"><Terminal size={10} /> {err.service}</span>
                             <span className="text-zinc-700">•</span>
                             <span>{err.route}</span>
                          </div>
                       </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                     <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-white font-mono">{err.count}</span>
                        <span className="text-[10px] text-zinc-600 uppercase font-black">Events</span>
                     </div>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="text-xs text-zinc-300 font-medium">{err.lastSeen}</div>
                    <div className="text-[10px] text-zinc-600 uppercase">Timestamp</div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                       <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border
                         ${err.status === 'Active' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'}
                       `}>
                         {err.status}
                       </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-violet-600 hover:border-violet-500 transition-all text-white group/btn">
                       <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/[0.01] border-t border-white/5 flex justify-between items-center z-10 relative">
           <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
             Showing {ERROR_GROUPS.length} aggregated issue groups
           </span>
           <div className="flex items-center gap-1 text-[10px] text-violet-400 font-black uppercase cursor-pointer hover:text-violet-300">
             Load More Issues <ArrowUpRight size={12} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorAnalysisPage;