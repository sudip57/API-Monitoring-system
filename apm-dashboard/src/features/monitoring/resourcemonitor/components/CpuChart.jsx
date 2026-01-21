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

export function CpuChart({ data }) {
  const { chartData, serviceNames } = useMemo(() => {
    const buckets = {};
    const names = new Set();

    data.forEach(item => {
      const sName = item.serviceName || item.meta?.serviceName;
      if (!sName) return;
      names.add(sName);

      const ts = Math.floor(new Date(item.timestamp).getTime() / 2000) * 2000;

      if (!buckets[ts]) buckets[ts] = { time: ts };
      
      // Ensure no negative values are stored in the data
      const cpuVal = item.metrics?.cpu?.percent || 0;
      buckets[ts][sName] = Math.max(0, cpuVal); 
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

  return (
    <div className="rounded-xl bg-[#09090b] p-6 border border-zinc-800 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">System CPU Utilization</h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-medium">Real-time telemetry</p>
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
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid
            stroke="#ffffff" 
            strokeOpacity={0.5} // Subtle grid lines
            strokeDasharray="3 3"
            vertical={true}
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
            yAxisId={0}
            domain={[0, 100]} // Fixed range
            ticks={[0, 20, 40, 60, 80, 100]} // Fixed grid positions
            allowDataOverflow={true} // Clips any data outside 0-100
            tick={{ fill: "#71717a", fontSize: 10 }}
            tickFormatter={v => `${v}%`}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1.5 }}
            contentStyle={{
              backgroundColor: "#16161e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
              padding: "12px",
              color: "#ffffff" // Header text to white
            }}
            itemStyle={{ color: "#ffffff", padding: "2px 0" }} // Metric text to white
            labelStyle={{ color: "#a1a1aa", marginBottom: "8px", fontSize: "10px", fontWeight: "bold" }}
            labelFormatter={t => new Date(t).toLocaleTimeString()}
            formatter={(value, name, props) => [
              <span key="val" style={{ color: props.color }}>{value.toFixed(1)}%</span>,
              <span key="name" style={{ color: '#ffffff', marginLeft: '4px' }}>{name}</span>
            ]}
          />

          {serviceNames.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}