import React from "react";

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
    bar: "bg-sky-400/80",
    title: "text-sky-300",
    value: "text-white"
  },
  "Throughput": {
    bar: "bg-emerald-400/80",
    title: "text-emerald-300",
    value: "text-white"
  },
  "Error Rate": {
    bar: "bg-rose-400/80",
    title: "text-rose-300",
    value: "text-rose-200"
  },
  "Avg Latency": {
    bar: "bg-indigo-400/80",
    title: "text-indigo-300",
    value: "text-white"
  },
  "Avg p95 Latency": {
    bar: "bg-violet-400/80",
    title: "text-violet-300",
    value: "text-white"
  }
};

const KpiCard = ({
  title,
  value,
  unit,
  loading = false,
  error = false,
}) => {
  const styles = KPI_STYLES[title] || {
    bar: "bg-slate-400/80",
    title: "text-white/70",
    value: "text-white"
  };

  const base =
    "min-w-[200px] min-h-[140px] flex-1 rounded-xl " +
    "bg-white/5 backdrop-blur-xl " +
    "border border-white/10";

  if (loading) {
    return (
      <div className={`${base} p-4 animate-pulse shadow-lg shadow-black/30`}>
        <div className="h-3 w-28 bg-white/10 rounded mb-3" />
        <div className="h-9 w-32 bg-white/10 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${base} p-4 shadow-lg shadow-black/30 border-rose-500/30`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="h-3 w-[3px] rounded bg-rose-400" />
          <p className="text-[12px] font-medium tracking-wide text-rose-400">
            {title}
          </p>
        </div>
        <p className="text-2xl font-semibold text-rose-400">—</p>
      </div>
    );
  }

  return (
    <div
      className={`
        ${base} p-4
        shadow-lg shadow-black/30
        transition-all duration-300 ease-out
        hover:border-white/30
        hover:shadow-xl hover:shadow-black/50
        cursor-pointer
        relative
      `}
    >

      <div className="
        pointer-events-none
        absolute inset-0
        rounded-xl
        bg-gradient-to-br
        from-white/10
        via-transparent
        to-transparent
      " />


      <div className="relative flex items-center gap-2 mb-2">
        <span className={`h-3 w-[3px] rounded ${styles.bar}`} />
        <p className={`text-[12px] font-medium tracking-wide ${styles.title}`}>
          {title}
        </p>
      </div>


      <div className="relative flex items-end gap-1.5">
        <span className={`text-2xl font-semibold leading-none ${styles.value}`}>
          {formatValue(value, unit)}
        </span>

        {unit && (
          <span className="pb-0.5 text-xs text-white/50">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
