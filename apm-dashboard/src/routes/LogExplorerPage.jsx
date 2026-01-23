import React from 'react';
import { 
  Search, Filter, Download, Terminal, 
  Clock, Play, Pause, ChevronRight, 
  Layers, HardDrive, Cpu, Info, AlertTriangle, AlertOctagon 
} from 'lucide-react';

// Hardcoded Log Data
const LOG_ENTRIES = [
  { id: 1, ts: "2024-05-20 14:22:01.452", level: "INFO", service: "auth-gateway", message: "Successfully authenticated user 88291", traceId: "b31...f2" },
  { id: 2, ts: "2024-05-20 14:22:03.110", level: "WARN", service: "payment-processor", message: "Retry attempt 1 for Stripe API: Connection timeout", traceId: "a12...d9" },
  { id: 3, ts: "2024-05-20 14:22:04.891", level: "ERROR", service: "inventory-db", message: "Query failed: SELECT * FROM stock WHERE id = 'xyz' - Deadlock detected", traceId: "c88...e1" },
  { id: 4, ts: "2024-05-20 14:22:05.002", level: "DEBUG", service: "auth-gateway", message: "Cache hit for session_id: sess_9912", traceId: "b31...f2" },
  { id: 5, ts: "2024-05-20 14:22:06.124", level: "INFO", service: "auth-gateway", message: "Incoming request: POST /api/v1/logout", traceId: "d44...a2" },
];

const LogExplorerPage = () => {
  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 p-6 flex flex-col h-screen overflow-hidden">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-zinc-800/50 rounded-xl border border-white/10">
            <Terminal size={20} className="text-zinc-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Log Explorer</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mt-0.5">Streaming 4,200 events/sec</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="flex bg-white/[0.03] border border-white/10 rounded-xl p-1">
              <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                <Play size={16} fill="currentColor" />
              </button>
              <button className="p-2 rounded-lg text-zinc-500 hover:text-white transition-all">
                <Pause size={16} fill="currentColor" />
              </button>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs font-bold uppercase hover:bg-white/[0.08] transition-all">
              <Download size={14} /> Export
           </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="flex gap-3 mb-6 shrink-0">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder='Filter by "service:auth-gateway level:error" or use full-text search...' 
            className="w-full h-12 bg-[#0c0c12] border border-white/10 rounded-xl pl-12 pr-4 text-sm font-mono text-zinc-300 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all shadow-inner"
          />
        </div>
        <button className="h-12 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-violet-600/20">
          Run Query
        </button>
      </div>

      {/* Log Histogram Placeholder */}
      <div className="w-full h-24 bg-white/[0.02] border border-white/5 rounded-2xl mb-6 flex items-end gap-1 p-4 shrink-0 overflow-hidden relative group cursor-crosshair">
         <div className="absolute top-2 left-4 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Log Volume Distribution</div>
         {[...Array(60)].map((_, i) => (
           <div 
             key={i} 
             className="flex-1 bg-violet-500/20 group-hover:bg-violet-500/40 rounded-t-sm transition-all" 
             style={{ height: `${Math.random() * 100}%` }}
           />
         ))}
      </div>

      {/* Main Logs Console */}
      <div className="flex-1 min-h-0 bg-[#08080c] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Table Header */}
        <div className="flex bg-white/[0.03] border-b border-white/5 text-[10px] uppercase font-black text-zinc-500 tracking-[0.15em] py-3 px-4 shrink-0">
           <div className="w-48">Timestamp</div>
           <div className="w-24 px-4 text-center">Level</div>
           <div className="w-40 px-4">Service</div>
           <div className="flex-1">Message</div>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto font-mono text-[12px] leading-relaxed custom-scrollbar">
          {LOG_ENTRIES.map((log) => (
            <div 
              key={log.id} 
              className="flex items-start border-b border-white/[0.02] hover:bg-white/[0.02] py-2.5 px-4 transition-colors group cursor-text"
            >
              <div className="w-48 shrink-0 text-zinc-500">{log.ts}</div>
              
              <div className="w-24 shrink-0 px-4 flex justify-center">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-1
                  ${log.level === 'ERROR' ? 'bg-rose-500/10 text-rose-500' : 
                    log.level === 'WARN' ? 'bg-amber-500/10 text-amber-500' : 
                    log.level === 'DEBUG' ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-500/10 text-zinc-400'}
                `}>
                  {log.level === 'ERROR' && <AlertOctagon size={10} />}
                  {log.level === 'WARN' && <AlertTriangle size={10} />}
                  {log.level === 'INFO' && <Info size={10} />}
                  {log.level}
                </span>
              </div>

              <div className="w-40 shrink-0 px-4 text-violet-400 font-bold opacity-80 group-hover:opacity-100">{log.service}</div>
              
              <div className="flex-1 text-zinc-300 group-hover:text-white break-all">
                {log.message}
                <span className="ml-3 text-[10px] text-zinc-700 font-bold hidden group-hover:inline-block cursor-pointer hover:text-violet-500 transition-colors">
                  TRACE: {log.traceId} <ChevronRight size={10} className="inline" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogExplorerPage;