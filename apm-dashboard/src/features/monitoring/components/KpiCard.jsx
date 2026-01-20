import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const formatValue = (value, unit) => {
  if (value === null || value === undefined) return "—";

  if (typeof value === "number") {
    if (unit === "%") return value.toFixed(2);
    if (unit === "ms") return Math.round(value);
    if (unit === "rps") return value.toFixed(2);
    return value.toLocaleString();
  }

  return value;
};

const KPI_STYLES = {
  "Total Requests": {
    bar: "bg-sky-400",
    glow: "shadow-sky-500/10",
    title: "text-sky-400/80",
    accent: "text-sky-400"
  },
  "Throughput": {
    bar: "bg-emerald-400",
    glow: "shadow-emerald-500/10",
    title: "text-emerald-400/80",
    accent: "text-emerald-400"
  },
  "Error Rate": {
    bar: "bg-rose-500",
    glow: "shadow-rose-500/20",
    title: "text-rose-400/80",
    accent: "text-rose-400"
  },
  "Avg Latency": {
    bar: "bg-indigo-400",
    glow: "shadow-indigo-500/10",
    title: "text-indigo-400/80",
    accent: "text-indigo-400"
  },
  "Avg p95 Latency": {
    bar: "bg-violet-400",
    glow: "shadow-violet-500/10",
    title: "text-violet-400/80",
    accent: "text-violet-400"
  }
};

const KpiCard = ({
  title,
  value,
  unit,
  change = 0, // Added for trend visualization
  loading = false,
  error = false,
}) => {
  const styles = KPI_STYLES[title] || {
    bar: "bg-slate-400",
    glow: "shadow-white/5",
    title: "text-white/60",
    accent: "text-white"
  };

  const base =
    "min-h-[120px] flex-1 rounded-xl relative overflow-hidden transition-all duration-300 " +
    "bg-[#0f0f15] border border-white/10 hover:border-white/20 ";

  if (loading) {
    return (
      <div className={`${base} p-5 animate-pulse`}>
        <div className="h-3 w-20 bg-white/5 rounded mb-4" />
        <div className="h-8 w-24 bg-white/5 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${base} p-5 border-rose-500/30 bg-rose-500/[0.02]`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="h-3 w-[2px] rounded-full bg-rose-500" />
          <p className="text-[10px] uppercase font-bold tracking-widest text-rose-500/70">
            {title}
          </p>
        </div>
        <p className="text-2xl font-mono font-bold text-rose-500/40">ERR_NULL</p>
      </div>
    );
  }

  return (
    <div className={`${base} ${styles.glow} p-5 group cursor-default`}>
      {/* Dynamic Background Glow */}
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${styles.bar}`} />
      
      {/* Header logic */}
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className={`h-3 w-[2px] rounded-full ${styles.bar} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
          <p className={`text-[10px] uppercase font-bold tracking-widest ${styles.title}`}>
            {title}
          </p>
        </div>

        {/* Trend Indicator (Mock logic) */}
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${change > 0 ? 'text-emerald-400' : change < 0 ? 'text-rose-400' : 'text-zinc-500'}`}>
            {change > 0 ? <TrendingUp size={10} /> : change < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      {/* Main Value Body */}
      <div className="relative z-10 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tracking-tighter text-white font-mono">
          {formatValue(value, unit)}
        </span>

        {unit && (
          <span className={`text-[11px] font-bold uppercase tracking-tight opacity-40 mb-1 ${styles.accent}`}>
            {unit}
          </span>
        )}
      </div>

      {/* Subtle Progress Bar (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.03]">
        <div 
          className={`h-full opacity-30 transition-all duration-1000 ${styles.bar}`} 
          style={{ width: loading ? '0%' : '100%' }} 
        />
      </div>
    </div>
  );
};

export default KpiCard;