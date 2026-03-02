import { useState, useEffect} from "react";
function findTrendValue(oldVal, newVal) {
  const oldRate = Number(oldVal);
  const newRate = Number(newVal);
  if (isNaN(oldRate) || isNaN(newRate)) return "0.00";
  if (oldRate === 0) return newRate === 0 ? "0.00" : "+100.00";
  const jump = ((newRate - oldRate) / oldRate) * 100;
  return (jump > 0 ? "+" : "") + jump.toFixed(2);
}
export function trendFinder(Data){
const [prevMetrics, setPrevMetrics] = useState(null);
const [trend, setTrend] = useState({
    latency: 0,
    errorRate: 0,
    rps: 0,
    p95Latency:0,
  });
console.log(Data)
useEffect(() => {
  setTrend(prev => {
    if (!prevMetrics) return prev;
    return {
      latency: findTrendValue(prevMetrics?.avgLatency, Data?.avgLatency),
      errorRate: findTrendValue(prevMetrics?.errorRate, Data?.errorRate),
      rps: findTrendValue(prevMetrics?.avgThroughPut, Data?.avgThroughPut),
      p95Latency: findTrendValue(prevMetrics?.p95Latency, Data?.p95Latency),
    };
  });
  setPrevMetrics(Data)
}, [Data]);
return {trend};
}
