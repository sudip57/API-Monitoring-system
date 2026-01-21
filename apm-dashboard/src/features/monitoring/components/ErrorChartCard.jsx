import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import { useAppContext } from "../../../context/GlobalAppContext"
import { useTimeSeries } from '../../../services/useTimeSeries'

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

const formatErrorRate = (v) => {
  if (v == null) return '–'
  if (v < 1) return v.toFixed(2)
  if (v < 10) return v.toFixed(1)
  return Math.round(v)
}

const ErrorChartCard = () => {
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
        Failed to load error metrics
      </div>
    )
  }

  return (
    <div className="
      w-[100%] min-h-[300px]
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
          Errors
        </div>

        <div className="flex gap-3 text-[11px] text-white/70">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Error rate %
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Error count
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.timeSeries} >
            <XAxis
              dataKey="timestamp"
              tickFormatter={(ts) =>
                formatTime(ts, timeRange.from, timeRange.to)
              }
              stroke="rgba(255,255,255,0.4)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />

            <CartesianGrid
              yAxisId="rate"
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="3 6"
              vertical={false}
            />

            {/* Error Rate % */}
            <YAxis
              width={22}
              yAxisId="rate"
              tickCount={6}
              stroke="rgba(255,255,255,0.35)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatErrorRate}
            />

            {/* Error Count */}
            <YAxis
              width={22}
              yAxisId="count"
              orientation="right"
              tickCount={6}
              stroke="rgba(255,255,255,0.25)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => Math.round(v)}
            />

            <Tooltip
              labelFormatter={(ts) => new Date(ts).toLocaleString()}
              formatter={(value, name) => {
                if (name === 'errorRate') {
                  return [`${formatErrorRate(value)} %`, 'Error rate']
                }
                if (name === 'errorCount') {
                  return [`${value} errors`, 'Count']
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
            />

            {/* Error Rate Line */}
            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="errorRate"
              stroke="#fb7185"
              strokeWidth={2}
              dot={false}
            />

            {/* Error Count Line */}
            <Line
              yAxisId="count"
              type="monotone"
              dataKey="errorCount"
              stroke="#fbbf24"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ErrorChartCard
