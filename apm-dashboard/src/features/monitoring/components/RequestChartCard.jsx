import React, { useState, useRef, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import { Activity, ChevronDown, Clock, RefreshCw } from 'lucide-react'
import { useAppContext } from "../../../context/GlobalAppContext"
import { useTimeSeries } from '../../../services/useTimeSeries'

const formatRps = (v) => {
  if (v == null) return '–'
  if (v < 1) return v.toFixed(2)
  if (v < 10) return v.toFixed(1)
  return Math.round(v)
}

const formatTime = (ts, from, to) => {
  const date = new Date(ts)
  const diff = to - from
  // Under 24 hours: Show Time
  if (diff <= 24 * 60 * 60 * 1000) {
     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const RequestChartCard = () => {
  const { timeRange, setTimeRange } = useAppContext()
  const { chartData, loading, error } = useTimeSeries(timeRange.from, timeRange.to)
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)



  if (loading && !chartData) {
    return <div className="h-[280px] md:h-[350px] w-full rounded-xl bg-white/5 border border-white/10 animate-pulse" />
  }

  return (
    <div className="w-full h-[280px] md:h-[350px] rounded-xl bg-[#0f0f15] border border-white/10 shadow-2xl p-3 md:p-5 flex flex-col relative overflow-visible">
      
      {/* Header */}
      <div className="relative flex items-center justify-between mb-4 md:mb-6 z-30">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
            <Activity size={16} className="text-violet-400" />
          </div>
          <div>
            <div className="text-xs md:text-sm font-semibold text-white tracking-tight flex items-center gap-1 md:gap-2">
              <span className="md:inline hidden">Request Traffic</span>
              <span className="md:hidden inline">Traffic</span>
              {loading && <RefreshCw size={10} className="animate-spin text-violet-400" />}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-10 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData?.timeSeries || []} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="reqRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
            
            <XAxis
              dataKey="timestamp"
              tickFormatter={(ts) => formatTime(ts, timeRange.from, timeRange.to)}
              stroke="rgba(255,255,255,0.5)" // Lightened for visibility
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
            />

            <YAxis 
              yAxisId="rate" 
              tickCount={4} 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={9} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(v) => `${formatRps(v)}`}
              width={45}
            />

            {/* TOOLTIP FIXES */}
            <Tooltip
              // labelFormatter fixes the date inside the tooltip
              labelFormatter={(label) => formatTime(label, timeRange.from, timeRange.to)}
              contentStyle={{ 
                backgroundColor: '#16161e', // Slightly lighter than background for depth
                border: '1px solid rgba(255,255,255,0.15)', 
                borderRadius: '12px', 
                fontSize: '12px',
                padding: '10px',
                color: '#FFFFFF', // Tooltip title to white
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ 
                color: '#FFFFFF', // Tooltip items to pure white
                paddingTop: '4px'
              }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
              formatter={(value, name) => 
                name === 'requestRate' 
                ? [`${formatRps(value)} RPS`, 'Rate'] 
                : [`${value} req`, 'Count']
              }
            />

            <Area yAxisId="rate" type="monotone" dataKey="requestRate" stroke="#a78bfa" strokeWidth={2} fill="url(#reqRate)" isAnimationActive={false} />
            <Area yAxisId="count" type="monotone" dataKey="requestCount" stroke="#38bdf8" strokeWidth={1} fillOpacity={0.05} fill="#38bdf8" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RequestChartCard