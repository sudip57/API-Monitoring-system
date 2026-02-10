import React, { useMemo } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { Activity, ShieldCheck, Zap, Clock } from 'lucide-react'
import { useAppContext } from "../../../context/GlobalAppContext"
import { useChartData } from '../../../services/useChartData'

const CombinedHealthRadar = () => {
  const { timeRange } = useAppContext()
  const { data, loading, error } = useChartData(timeRange.rangeMinutes)

  const radarData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const latest = data[data.length - 1];

    return [
      {
        subject: 'P95 LATENCY',
        value: Math.min((latest.p95Latency || 0) / 10, 100), 
        originalValue: `${Math.round(latest.p95Latency || 0)}ms`,
      },
      {
        subject: 'AVG LATENCY',
        value: Math.min((latest.avgLatency || 0) / 5, 100), 
        originalValue: `${Math.round(latest.avgLatency || 0)}ms`,
      },
      {
        subject: 'ERROR RATE',
        value: Math.min((latest.errorRate || 0) * 10, 100), 
        originalValue: `${(latest.errorRate || 0).toFixed(2)}%`,
      }
    ];
  }, [data]);

  if (loading) return <div className="h-[550px] w-full rounded-2xl bg-[#09090b] border border-zinc-800 animate-pulse" />;

  return (
    <div className="group relative w-[500px] h-[550px] rounded-2xl bg-[#09090b] border border-zinc-800 shadow-2xl p-8 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/20 rounded-lg border border-violet-500/30">
            <Activity size={20} className="text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">System Reliability</h3>
            <p className="text-xs text-zinc-500 font-medium tracking-wide">Real-time telemetry profile</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          Live
        </div>
      </div>

      {/* Enlarged Radar Center */}
      <div className="flex-1 w-full min-h-0 relative mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="75%" // Balanced for large text and large shape
            data={radarData}
          >
            {/* 1. VISIBILITY: Sharper Matrix Grid */}
            <PolarGrid stroke="#3f3f46" strokeWidth={1} />
            
            <PolarAngleAxis 
              dataKey="subject" 
              tick={(props) => {
                const { x, y, payload } = props;
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#FFFFFF" // Pure white for max visibility
                    fontSize={12}
                    fontWeight={900}
                    textAnchor="middle"
                    style={{ letterSpacing: '0.1em' }}
                  >
                    {payload.value}
                  </text>
                );
              }}
            />
            
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />

            {/* 2. HOVER EFFECT: This adds the highlighting "ruler" line */}
            <Tooltip
              cursor={{ 
                stroke: '#8b5cf6', 
                strokeWidth: 2, 
                strokeDasharray: '4 4' 
              }}
              contentStyle={{ 
                backgroundColor: '#09090b', 
                border: '1px solid #3f3f46', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#a78bfa' }}
              formatter={(value, name, props) => [props.payload.originalValue, "Value"]}
            />

            <Radar
              name="Health"
              dataKey="value"
              stroke="#A78BFA"
              strokeWidth={3}
              fill="#8B5CF6"
              fillOpacity={0.4}
              // 3. HOVER EFFECT: Active dot makes it clear where the mouse is
              activeDot={{ r: 6, fill: '#fff', stroke: '#8b5cf6', strokeWidth: 2 }}
              isAnimationActive={true}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Metric Cards - Cleaner Grid */}
      <div className="grid grid-cols-3 gap-6 mt-6 pt-8 border-t border-zinc-800/80">
        <MetricCard label="P95 Latency" value={radarData[0]?.originalValue} icon={<Clock size={14}/>} color="text-violet-400" />
        <MetricCard label="Avg Latency" value={radarData[1]?.originalValue} icon={<Zap size={14}/>} color="text-amber-400" />
        <MetricCard label="Error Rate" value={radarData[2]?.originalValue} icon={<ShieldCheck size={14}/>} color="text-rose-400" />
      </div>
    </div>
  )
}

const MetricCard = ({ label, value, icon, color }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 mb-1">
      <span className="opacity-70">{icon}</span>
      <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-xl font-mono font-bold ${color}`}>{value || '0'}</span>
  </div>
)

export default CombinedHealthRadar