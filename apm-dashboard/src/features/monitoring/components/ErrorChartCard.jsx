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
import { AlertCircle, TrendingUp } from 'lucide-react'
import { useAppContext } from "../../../context/GlobalAppContext"
import { useTimeSeries } from '../../../services/useTimeSeries'

const formatTime = (ts, from, to) => {
  const date = new Date(ts)
  const diff = to - from
  if (diff <= 60 * 60 * 1000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diff <= 24 * 60 * 60 * 1000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const formatErrorRate = (v) => {
  if (v == null) return '0%'
  return `${v < 1 ? v.toFixed(2) : Math.round(v)}%`
}

const ErrorChartCard = () => {
  const { timeRange } = useAppContext()
  const { chartData, loading, error } = useTimeSeries(timeRange.from, timeRange.to)

  if (loading) {
    return <div className="h-[300px] w-full rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse" />
  }

  if (error) {
    return (
      <div className="h-[300px] w-full rounded-2xl bg-white/[0.03] border border-red-500/20 flex flex-col items-center justify-center gap-2">
        <AlertCircle className="text-red-400" size={24} />
        <span className="text-sm text-red-400/80 font-medium">Failed to sync error data</span>
      </div>
    )
  }

  return (
    <div className="group relative w-full h-[320px] rounded-2xl bg-[#0c0c12] border border-white/10 shadow-2xl p-5 flex flex-col transition-all hover:border-white/20 overflow-hidden">
      
      {/* Background Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
            <AlertCircle size={18} className="text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Error Distribution</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Failure Analysis</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <span className="text-[10px] font-medium text-zinc-400">Rate %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <span className="text-[10px] font-medium text-zinc-400">Count</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full min-h-0 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData?.timeSeries || []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
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
              yAxisId="rate"
              tickCount={5}
              stroke="rgba(255,255,255,0.3)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatErrorRate}
              width={40}
            />

            <YAxis
              yAxisId="count"
              orientation="right"
              tickCount={5}
              stroke="rgba(255,255,255,0.2)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              width={35}
            />

            <Tooltip
              labelFormatter={(ts) => formatTime(ts, timeRange.from, timeRange.to)}
              contentStyle={{
                backgroundColor: '#111118',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '11px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#fff', padding: '2px 0' }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
              formatter={(value, name) => 
                name === 'errorRate' 
                ? [`${value.toFixed(2)}%`, 'Error Rate'] 
                : [`${value}`, 'Total Errors']
              }
            />

            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="errorRate"
              stroke="#fb7185"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#fb7185' }}
              isAnimationActive={false}
            />

            <Line
              yAxisId="count"
              type="monotone"
              dataKey="errorCount"
              stroke="#fbbf24"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#fbbf24' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ErrorChartCard