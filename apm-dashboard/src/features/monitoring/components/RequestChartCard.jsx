import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import { Activity, RefreshCw } from 'lucide-react'
import { useAppContext } from "../../../context/GlobalAppContext"
import { useTimeSeries } from '../../../services/useTimeSeries'

const formatRps = (v) => {
  if (v == null) return '0'
  return v < 1 ? v.toFixed(2) : Math.round(v)
}

const formatTime = (ts, from, to) => {
  const date = new Date(ts)
  const diff = to - from
  if (diff <= 24 * 60 * 60 * 1000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const RequestChartCard = () => {
  const { timeRange } = useAppContext()
  const { chartData, loading, error } = useTimeSeries(timeRange.from, timeRange.to)

  if (loading && !chartData) {
    return <div className="h-[320px] w-full rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse" />
  }

  return (
    <div className="group relative w-full h-[320px] rounded-2xl bg-[#0c0c12] border border-white/10 shadow-2xl p-5 flex flex-col transition-all hover:border-white/20 overflow-hidden">
      
      {/* Refractive Glass Glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-xl border border-violet-500/20">
            <Activity size={18} className="text-violet-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
               <h3 className="text-sm font-semibold text-white tracking-tight">Request Traffic</h3>
               {loading && <RefreshCw size={12} className="animate-spin text-violet-400/60" />}
            </div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Throughput Analysis</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
            <span className="text-[10px] font-medium text-zinc-400 uppercase">Rate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
            <span className="text-[10px] font-medium text-zinc-400 uppercase">Count</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full min-h-0 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData?.timeSeries || []} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="reqRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="reqCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
            </defs>

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

            {/* Left Axis: RPS Rate */}
            <YAxis 
              yAxisId="rate" 
              tickCount={5} 
              stroke="rgba(139, 92, 246, 0.5)" // Themed to match violet line
              fontSize={9} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(v) => `${formatRps(v)}`}
              width={45}
            />

            {/* Right Axis: Total Count */}
            <YAxis 
              yAxisId="count" 
              orientation="right"
              tickCount={5} 
              stroke="rgba(56, 189, 248, 0.5)" // Themed to match sky line
              fontSize={9} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
              width={40}
            />

            <Tooltip
              labelFormatter={(label) => formatTime(label, timeRange.from, timeRange.to)}
              contentStyle={{ 
                backgroundColor: '#111118', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                fontSize: '11px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#FFFFFF', padding: '2px 0' }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
            />

            <Area 
              yAxisId="rate" 
              type="monotone" 
              dataKey="requestRate" 
              stroke="#a78bfa" 
              strokeWidth={2} 
              fill="url(#reqRate)" 
              isAnimationActive={false} 
            />
            <Area 
              yAxisId="count" 
              type="monotone" 
              dataKey="requestCount" 
              stroke="#38bdf8" 
              strokeWidth={1.5} 
              fill="url(#reqCount)" 
              strokeDasharray="4 4" 
              isAnimationActive={false} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RequestChartCard