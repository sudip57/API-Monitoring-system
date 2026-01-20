import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const WINDOW_MS = 60 * 1000; // 60s window

export function CpuChart({ data }) {
  console.log("CpuChart data:", data);
  const chartData = data.map(d => ({
    time: new Date(d.timestamp).getTime(),
    cpu: d.metrics.cpu.percent
  }));

  const latestTime =
    chartData.length > 0
      ? chartData[chartData.length - 1].time
      : Date.now();

  const domainStart = latestTime - WINDOW_MS;
  const domainEnd = latestTime;

  const latestCpu =
    chartData.length > 0
      ? chartData[chartData.length - 1].cpu
      : 0;

  return (
    <div className="rounded-xl bg-black p-4 border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-zinc-400">CPU Usage</h3>
        <span className="text-sm text-pink-500">
          {latestCpu.toFixed(1)}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          {/* Grid (stable) */}
          <CartesianGrid
            stroke="#722F37"
            strokeDasharray="3 3"
            vertical={true}
          />

          {/* X Axis (FIXED WINDOW) */}
          <XAxis
            dataKey="time"
            type="number"
            domain={[domainStart, domainEnd]}
            allowDataOverflow
            tickCount={5}
            tickFormatter={t =>
              new Date(t).toLocaleTimeString([], {
                minute: "2-digit",
                second: "2-digit"
              })
            }
            tick={{ fill: "#71717a", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#71717a", fontSize: 11 }}
            tickFormatter={v => `${v}%`}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              fontSize: "12px"
            }}
            labelStyle={{
                color: "#fff", 
                fontWeight: 500
              }}
              itemStyle={{
                color: "#f472b6" 
              }}
            labelFormatter={label =>
              new Date(label).toLocaleTimeString()
            }
            formatter={value => [`${value}%`, "CPU"]}
          />

          {/* Line */}
          <Line
            dataKey="cpu"
            stroke="#E0115F"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
