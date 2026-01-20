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
import { Activity, ChevronDown, Clock, Info, RefreshCw } from 'lucide-react'
import { useAppContext } from "../../../context/GlobalAppContext"
import { useTimeSeries } from '../../../services/useTimeSeries'

const formatRps = (v) => {
  if (v == null) return '–'
  if (v < 1) return v.toFixed(2)
  if (v < 10) return v.toFixed(1)
  return Math.round(v)
}

const formatTime = (ts, from, to) => {
  const diff = to - from
  if (diff <= 60 * 60 * 1000) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const RequestChartCard = () => {
  const { timeRange, setTimeRange } = useAppContext()
  const { chartData, loading, error } = useTimeSeries(timeRange.from, timeRange.to)
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const options = [
    { label: 'Last 15 minutes', value: 15 },
    { label: 'Last 60 minutes', value: 60 },
    { label: 'Last 24 hours', value: 1440 },
  ]

  const handleRefresh = (minutes) => {
    const now = Date.now()
    const from = now - (minutes * 60 * 1000)
    timeRange.setRangeMinutes(minutes)
    if (setTimeRange) {
      setTimeRange({ from, to: now })
    }
    
    setIsMenuOpen(false)
  }

  if (loading && !chartData) {
    return <div className="h-[350px] w-full rounded-xl bg-white/5 border border-white/10 animate-pulse" />
  }

  return (
    <div className="w-full  min-h-[350px] rounded-xl bg-[#0f0f15] border border-white/10 shadow-2xl p-5 flex flex-col relative overflow-visible">
      
      <div className="relative flex items-center justify-between mb-6 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
            <Activity size={18} className="text-violet-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              Request Traffic
              {loading && <RefreshCw size={12} className="animate-spin text-violet-400" />}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Real-time Ingress
            </div>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[11px] font-medium text-white/70 hover:bg-white/10 transition-all"
          >
            <Clock size={14} className="text-violet-400" />
            {options.find(o => o.value === timeRange.selectedMinutes)?.label || 'Select Interval'}
            <ChevronDown size={14} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl py-1 z-50 overflow-hidden backdrop-blur-xl">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleRefresh(opt.value)}
                  className="w-full text-left px-4 py-2.5 text-[11px] text-white/70 hover:bg-violet-600 hover:text-white transition-colors flex justify-between items-center"
                >
                  {opt.label}
                  <span className="text-[9px] opacity-40">{opt.value}m</span>
                </button>
              ))}
              <div className="border-t border-white/5 mt-1">
                <button 
                  onClick={() => handleRefresh(timeRange.selectedMinutes || 15)}
                  className="w-full text-left px-4 py-2 text-[10px] text-violet-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={10} />Refresh Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData?.timeSeries || []} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="reqRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timestamp"
              tickFormatter={(ts) => formatTime(ts, timeRange.from, timeRange.to)}
              stroke="rgba(255,255,255,0.2)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />

            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
            <YAxis yAxisId="rate" tickCount={5} stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={formatRps} />
            <YAxis yAxisId="count" orientation="right" tickCount={5} stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />

            <Tooltip
              contentStyle={{ backgroundColor: '#0f0f15', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
              formatter={(value, name) => name === 'requestRate' ? [`${formatRps(value)} RPS`, 'Rate'] : [`${value} req`, 'Count']}
            />

            <Area yAxisId="rate" type="monotone" dataKey="requestRate" stroke="#8b5cf6" strokeWidth={2} fill="url(#reqRate)" isAnimationActive={false} />
            <Area yAxisId="count" type="monotone" dataKey="requestCount" stroke="#38bdf8" strokeWidth={1} fillOpacity={0.05} fill="#38bdf8" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RequestChartCard