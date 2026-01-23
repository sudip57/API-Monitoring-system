import React from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import { Clock, Zap } from 'lucide-react'
import { useAppContext } from "../../../context/GlobalAppContext"
import { useTimeSeries } from '../../../services/useTimeSeries'

const formatLatency = (v) => {
  if (v == null) return '–'
  if (v < 1000) return `${Math.round(v)}ms`
  return `${(v / 1000).toFixed(2)}s`
}

const formatTime = (ts, from, to) => {
  const date = new Date(ts)
  const diff = to - from
  if (diff <= 24 * 60 * 60 * 1000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const LatencyChartCard = () => {
  const { timeRange } = useAppContext()
  const { chartData, loading, error } = useTimeSeries(timeRange.from, timeRange.to)

  if (loading) {
    return <div className="h-[320px] w-full rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse" />
  }

  if (error) {
    return (
      <div className="h-[320px] w-full rounded-2xl bg-white/[0.03] border border-red-500/20 flex flex-col items-center justify-center gap-2">
        <Zap className="text-red-400" size={24} />
        <span className="text-sm text-red-400/80 font-medium">Failed to sync latency metrics</span>
      </div>
    )
  }

  return (
    <div className="group relative w-full h-[320px] rounded-2xl bg-[#0c0c12] border border-white/10 shadow-2xl p-5 flex flex-col transition-all hover:border-white/20 overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Clock size={18} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Response Latency</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Execution Speed</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-[10px] font-medium text-zinc-400">Average</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-1.5 rounded-sm bg-indigo-500/80" />
            <span className="text-[10px] font-medium text-zinc-400">P95 Range</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-0 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData?.timeSeries || []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
            
            <XAxis
              dataKey="timestamp"
              tickFormatter={(ts) => formatTime(ts, timeRange.from, timeRange.to)}
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
            />

            <YAxis
              tickCount={5}
              stroke="rgba(255,255,255,0.3)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}ms`}
              width={45}
            />

            <Tooltip
              labelFormatter={(ts) => new Date(ts).toLocaleString()}
              contentStyle={{
                backgroundColor: '#111118',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '11px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#fff', padding: '2px 0' }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              formatter={(value, name) => 
                name === 'p95Latency' 
                ? [formatLatency(value), 'P95 Peak'] 
                : [formatLatency(value), 'Average']
              }
            />

            {/* P95 Context - Subtle Bars */}
            <Bar
              dataKey="p95Latency"
              fill="rgba(99, 102, 241, 0.40)"
              radius={[2, 2, 0, 0]}
              barSize={12}
              isAnimationActive={false}
            />

            {/* Avg Signal - Sharp Line */}
            <Line
              type="monotone"
              dataKey="avgLatency"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#34d399' }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default LatencyChartCard