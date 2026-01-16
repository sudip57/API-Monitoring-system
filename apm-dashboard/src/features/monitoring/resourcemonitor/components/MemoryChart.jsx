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
const Y_STEP = 20;          

export function MemoryChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-black p-4 border border-zinc-800 text-zinc-500 text-sm">
        Memory (RSS) — waiting for data…
      </div>
    );
  }

  const chartData = data.map(d => ({
    time: new Date(d.timestamp).getTime(),
    rss: d.metrics.memory.rssMB
  }));

  const latestTime = chartData[chartData.length - 1].time;
  const latestRss = chartData[chartData.length - 1].rss;

  // ---- FIXED time window ----
  const domainStart = latestTime - WINDOW_MS;
  const domainEnd = latestTime;

  // ---- STABLE Y DOMAIN (quantized) ----
  const yMin = Math.floor((latestRss - Y_STEP) / Y_STEP) * Y_STEP;
  const yMax = Math.ceil((latestRss + Y_STEP) / Y_STEP) * Y_STEP;

  return (
    <div className="rounded-xl bg-black p-4 border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-zinc-400">Memory (RSS)</h3>
        <span className="text-sm text-emerald-400">
          {latestRss.toFixed(1)} MB
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          {/* Grid (now stable) */}
          <CartesianGrid
            stroke="#27272a"
            strokeDasharray="3 3"
            vertical={true}
          />

          {/* X Axis */}
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

          {/* Y Axis (FIXED) */}
          <YAxis
            domain={[yMin, yMax]}
            tickCount={5}
            tick={{ fill: "#71717a", fontSize: 11 }}
            tickFormatter={(v) => Math.round(v)}
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
            labelFormatter={label =>
              new Date(label).toLocaleTimeString()
            }
            formatter={value => [`${value} MB`, "RSS"]}
          />

          {/* Line */}
          <Line
            dataKey="rss"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
