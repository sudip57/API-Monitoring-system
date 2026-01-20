export function ResourceMetricCard({ latest }) {
  const m = latest[0].metrics;

  return (
    <div className="rounded-xl p-3 shadow-xl ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-zinc-300">
          Resource Metrics
        </h3>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          Live
        </div>
      </div>

      {/* Rings */}
      <div className="grid grid-cols-3">
        <RingKPI
          label="CPU"
          value={m.cpu.percent}
          max={100}
          unit="%"
          gradient="cpu"
        />

        <RingKPI
          label="Memory"
          value={m.memory.rssMB}
          max={16000}
          unit="MB"
          gradient="memory"
        />

        <RingKPI
          label="Uptime"
          value={m.uptimeSec}
          max={86400}
          formatter={formatUptime}
          gradient="uptime"
        />
      </div>
    </div>
  );
}
function RingKPI({
  label,
  value,
  max,
  unit,
  formatter,
  gradient
}) {
  const radius = 50;
  const stroke = 8;
  const size = 120;
  const center = size / 2;

  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  const gradients = {
    cpu: "url(#grad-cpu)",
    memory: "url(#grad-mem)",
    uptime: "url(#grad-up)"
  };

  const displayValue = formatter
    ? formatter(value)
    : value.toFixed(1);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="mb-2">
        <defs>
          <linearGradient id="grad-cpu" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>

          <linearGradient id="grad-mem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#a3e635" />
          </linearGradient>

          <linearGradient id="grad-up" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#27272a"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={gradients[gradient]}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-all duration-700 ease-out"
        />

        {/* CENTER TEXT */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-white font-semibold text-lg"
        >
          {displayValue}
          {unit && (
            <tspan
              dx="2"
              className="fill-zinc-400 text-xs font-normal"
            >
              {unit}
            </tspan>
          )}
        </text>
      </svg>

      <p className="text-xs text-zinc-500 mt-1">{label}</p>
    </div>
  );
}

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
