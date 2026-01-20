import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const WINDOW_MS = 60 * 1000;

export function MemoryChart({ data = [] }) {
  const { chartData, serviceNames } = useMemo(() => {
    const buckets = {};
    const names = new Set();

    data.forEach(item => {
      const sName = item.serviceName || item.meta?.serviceName;
      if (!sName) return;
      names.add(sName);

      const ts = Math.floor(new Date(item.timestamp).getTime() / 2000) * 2000;

      if (!buckets[ts]) buckets[ts] = { time: ts };
      buckets[ts][sName] = item.metrics?.memory?.rssMB || 0;
    });

    return {
      chartData: Object.values(buckets).sort((a, b) => a.time - b.time),
      serviceNames: Array.from(names)
    };
  }, [data]);

  const latestTime = chartData.length > 0 
    ? chartData[chartData.length - 1].time 
    : Date.now();

  const COLORS = ["#10b981", "#3b82f6", "#f43f5e", "#f59e0b", "#8b5cf6", "#06b6d4"];

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-black p-4 border border-zinc-800 text-zinc-500 text-sm">
        Memory (RSS) — waiting for data…
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#09090b] p-6 border border-zinc-800 shadow-2xl">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">Memory Usage (RSS)</h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-medium">Resource snapshot</p>
        </div>
        <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 max-w-[60%]">
          {serviceNames.map((name, i) => (
             <div key={name} className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
               <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">{name}</span>
             </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>

          <CartesianGrid
            stroke="#F9F6EE"
            strokeOpacity={0.5}
            strokeDasharray="1 1"
            vertical={true}
            horizontal={true}
          />

          <XAxis
            dataKey="time"
            type="number"
            domain={[latestTime - WINDOW_MS, latestTime]}
            tickFormatter={t => new Date(t).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" })}
            tick={{ fill: "#71717a", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#71717a", fontSize: 10 }}
            tickFormatter={v => `${Math.round(v)}MB`}
            axisLine={false}
            tickLine={false}
            tickCount={6}
          />
          <Tooltip
            cursor={{ stroke: '#3f3f46', strokeWidth: 1.5 }}
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              fontSize: "12px",
              padding: "12px",
            }}
            itemStyle={{ padding: "2px 0", fontWeight: "600" }}
            labelStyle={{ color: "#a1a1aa", marginBottom: "8px", fontSize: "10px", fontWeight: "bold" }}
            labelFormatter={t => new Date(t).toLocaleTimeString()}
            formatter={(value, name, props) => [
              <span style={{ color: props.color, fontSize: "13px" }}>{value.toFixed(1)} MB</span>,
              <span className="text-zinc-400 ml-1">{name}</span>
            ]}
          />
          {serviceNames.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              name={name}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: COLORS[index % COLORS.length] }}
              isAnimationActive={false}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}