import React from 'react'
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import { useAppContext } from "../../context/GlobalAppContext"
import { useTimeSeries } from '../../scripts/useTimeSeries'

const formatLatency = (v) => {
  if (v == null) return '–'
  if (v < 1000) return `${Math.round(v)} ms`
  return `${(v / 1000).toFixed(2)} s`
}

const formatTime = (ts, from, to) => {
  const diff = to - from

  if (diff <= 60 * 60 * 1000) {
    return new Date(ts).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (diff <= 24 * 60 * 60 * 1000) {
    return new Date(ts).toLocaleTimeString([], {
      hour: '2-digit'
    })
  }

  return new Date(ts).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  })
}

const LatencyChartCard = () => {
  const { timeRange } = useAppContext()
  const { chartData, loading, error } = useTimeSeries(
    timeRange.from,
    timeRange.to
  )

  if (loading) {
    return (
      <div className="
        h-[320px] w-[400px]
        rounded-xl
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        animate-pulse
      " />
    )
  }

  if (error) {
    return (
      <div className="
        h-[320px] w-[400px]
        rounded-xl
        bg-white/5
        backdrop-blur-xl
        border border-red-500/20
        flex items-center justify-center
        text-sm text-red-400
      ">
        Failed to load latency data
      </div>
    )
  }

  return (
    <div className="
      w-[100%] h-[100%]
      rounded-xl
      bg-white/5
      backdrop-blur-xl
      border border-white/10
      shadow-xl shadow-black/40
      p-3
      flex flex-col
      relative
      overflow-hidden
    ">
      {/* Glass highlight */}
      <div className="
        pointer-events-none
        absolute inset-0
        rounded-xl
        bg-gradient-to-br
        from-white/10
        via-transparent
        to-transparent
      " />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-white/90">
          Latency
        </div>
        <div className="flex gap-3 text-[11px] text-white/70">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            P95
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Avg
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.timeSeries} barGap={4}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(ts) =>
                formatTime(ts, timeRange.from, timeRange.to)
              }
              stroke="rgba(255,255,255,0.4)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />

            <CartesianGrid
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="3 6"
              vertical={false}
            />

            <YAxis
              domain={[0, 'auto']}
              stroke="rgba(255,255,255,0.35)"
              width={22}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => Math.round(v)}
            />

            <Tooltip
              labelFormatter={(ts) => new Date(ts).toLocaleString()}
              formatter={(value, name) => {
                if (name === 'p95Latency') {
                  return [formatLatency(value), 'P95 latency']
                }
                if (name === 'avgLatency') {
                  return [formatLatency(value), 'Avg latency']
                }
                return value
              }}
              contentStyle={{
                backgroundColor: 'rgba(24,24,27,0.65)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#e5e7eb'
              }}
               labelStyle={{
                  color: '#f9fafb',     // top label
                  fontSize: '12px'
                }}
                itemStyle={{
                  color: '#e5e7eb'      // row text
                }}
            />

            {/* P95 latency — translucent bars (context only) */}
            <Bar
              dataKey="p95Latency"
              fill="rgba(129,140,248,0.3)"
              isAnimationActive={false}
            />

            {/* Avg latency — primary signal */}
            <Line
              type="monotone"
              dataKey="avgLatency"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
              strokeDasharray="4 4"
              connectNulls
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default LatencyChartCard
