import React from 'react'

const StatusDistribution = ({ routeData }) => {

    console.log("routD---",routeData)
  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes('success') || s.includes('active')||s.startsWith('2')) return 'bg-emerald-400';
    if (s.includes('pending') || s.includes('warn')) return 'bg-amber-500';
    if (s.includes('error') || s.includes('fail') ||s.startsWith('5'))return 'bg-rose-500';
    if (s.includes('error') || s.includes('fail') ||s.startsWith('4'))return 'bg-orange-400';
    return 'bg-blue-500'; 
  };
  const total = routeData?.statusInfo?.reduce((acc, curr) => acc + curr.count, 0) || 1;
  return (
    <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Status Distribution
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-500 border border-white/5">
          {total} Total
        </span>
      </div>

      <div className="space-y-5">
        {routeData?.statusInfo?.map((s, i) => {
          const percentage = ((s.count / total) * 100).toFixed(1);
          const colorClass = getStatusColor(s.status);

          return (
            <div key={i} className="group">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
                  <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                    {s.status}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[15px] text-white font-mono">{percentage}%</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass} opacity-80 group-hover:opacity-100`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default StatusDistribution
