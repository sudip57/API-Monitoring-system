import { LiveMetrics } from "../hooks/useLiveMetrics";
import { ResourceMetricCard } from "./components/ResourceMetricCard";
import { CpuChart } from "./components/CpuChart";
import { MemoryChart } from "./components/MemoryChart";

export default function ResourceMonitor() {
  const { latest, series } = LiveMetrics();
  if (!latest) return <p className="text-white">Loading...</p>;
  console.log("Resource Monitor Data:", latest);
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-2">
        <ResourceMetricCard latest={latest.latest} series={series}/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CpuChart data={latest.timeSeries} />
          <MemoryChart data={latest.timeSeries} />
        </div>
        
      </div>
    </div>
  );
}
