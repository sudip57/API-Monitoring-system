export default function ServiceCard({ title, description, metric, accent }) {
  return (
    <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 hover:scale-[1.02] transition">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-300">
          {title}
        </h3>

        <span
          className={`text-xs font-semibold bg-gradient-to-r ${accent} bg-clip-text text-transparent`}
        >
          LIVE
        </span>
      </div>

      <p className="text-sm text-zinc-400 mb-4">
        {description}
      </p>

      <div
        className={`text-2xl font-semibold bg-gradient-to-r ${accent} bg-clip-text text-transparent`}
      >
        {metric}
      </div>
    </div>
  );
}
