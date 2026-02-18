import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { Cpu } from 'lucide-react';

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
      
      const cpuVal = item.cpu?.percent || 0;
      buckets[ts][sName] = Math.max(0, Math.min(100, cpuVal)); 
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
    <div className="group relative w-full h-full rounded-2xl bg-[#0c0c12] border border-white/10 shadow-2xl p-5 flex flex-col hover:border-white/20 overflow-hidden">
      
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px]" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Cpu size={18} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">CPU Utilization</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              System Load %
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 bg-white/[0.02] px-3 py-1.5 rounded-xl border border-white/5">
          {serviceNames.map((name, i) => (
            <div key={name} className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: COLORS[i % COLORS.length],
                  boxShadow: `0 0 8px ${COLORS[i % COLORS.length]}80`
                }}
              />
              <span className="text-[10px] text-zinc-400">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            
            <CartesianGrid
              stroke="rgba(255,255,255,0.15)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
              type="number"
              domain={[latestTime - WINDOW_MS, latestTime]}
              tickFormatter={t =>
                new Date(t).toLocaleTimeString([], {
                  minute: "2-digit",
                  second: "2-digit"
                })
              }
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
              contentStyle={{
                backgroundColor: "#111118",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "11px"
              }}
              formatter={(value, name, props) => [
                <span style={{ color: props.color, fontWeight: 600 }}>
                  {value.toFixed(1)}%
                </span>,
                name
              ]}
              labelFormatter={t => new Date(t).toLocaleTimeString()}
            />

            {serviceNames.map((name, index) => (
              <Area
                key={name}
                type="monotone"
                dataKey={name}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.50}
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
                connectNulls
              />
            ))}

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
