
export default function MetricPreview() {
  return (
    <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 grid grid-cols-3 gap-6">
      {[
        { label: "CPU", value: "23%", color: "text-pink-400" },
        { label: "Memory", value: "1.2GB", color: "text-emerald-400" },
        { label: "Latency", value: "180ms", color: "text-sky-400" }
      ].map(m => (
        <div key={m.label} className="text-center">
          <p className="text-xs text-zinc-500">{m.label}</p>
          <p className={`text-2xl font-semibold ${m.color}`}>
            {m.value}
          </p>
        </div>
      ))}
    </div>
  );
}
