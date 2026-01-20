import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const TOP_N = 5;

// Get latest CPU per service
function buildServiceSnapshot(data) {
  const map = new Map();

  for (let i = data.length - 1; i >= 0; i--) {
    const d = data[i];
    const service = d.meta?.serviceName;

    if (!map.has(service)) {
      const used = d.metrics?.memory?.rssMB ?? 0;
      const total = d.metrics?.systemMemory?.totalMB ?? 1;

      map.set(service, {
        service,
        cpu: d.metrics?.cpu?.percent ?? 0,
        memoryPct: (used / total) * 100,
        memoryUsed: used,
        memoryTotal: total
      });
    }
  }

  return Array.from(map.values());
}



export function CpuMemoryChart({ data }) {
  const chartData = buildServiceSnapshot(data);

  // Assume same total memory across services (typical)
  const totalMemory =
    chartData.length > 0 ? chartData[0].memoryTotal : 0;

  return (
    <div className="rounded-xl bg-black p-4 border border-zinc-800">
      <h3 className="text-sm text-zinc-400 mb-3">
        CPU & Memory Usage per Service
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid stroke="#27272a" />

          {/* X Axis */}
          <XAxis
            dataKey="service"
            tick={{ fill: "#f4f4f5", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* CPU Axis */}
          <YAxis
            yAxisId="cpu"
            domain={[0, 100]}
            tickFormatter={v => `${v}%`}
            tick={{ fill: "#E0115F", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          {/* MEMORY Axis (percentage of total) */}
          <YAxis
            yAxisId="memory"
            orientation="right"
            domain={[0, 100]}
            tickFormatter={v =>
              `${Math.round((v / 100) * totalMemory)} MB`
            }
            tick={{ fill: "#34d399", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              fontSize: "12px",
              color: "#f4f4f5"
            }}
            formatter={(value, name, props) => {
              if (name === "cpu") {
                return [`${value.toFixed(1)}%`, "CPU"];
              }
              if (name === "memoryPct") {
                return [
                  `${props.payload.memoryUsed.toFixed(1)} / ${props.payload.memoryTotal} MB`,
                  "Memory"
                ];
              }
              return value;
            }}
          />

          {/* CPU BAR */}
          <Bar
            yAxisId="cpu"
            dataKey="cpu"
            fill="#E0115F"
            opacity={0.85}
            barSize={42}
            radius={[6, 6, 0, 0]}
          />

          {/* MEMORY BAR (overlapping) */}
          <Bar
            yAxisId="memory"
            dataKey="memoryPct"
            fill="#34d399"
            opacity={0.55}
            barSize={42}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
