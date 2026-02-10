import { useLiveMetrics } from "../hooks/useLiveMetrics";
import { ResourceMetricCard } from "./components/ResourceMetricCard";
import { CpuChart } from "./components/CpuChart";
import { MemoryChart } from "./components/MemoryChart";

export default function ResourceMonitor() {
  const { latest, series } = useLiveMetrics({ projectkey: "test-project" });
  
  if (!latest) {
    return <p className="text-white">Loading...</p>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CpuChart data={series} />
      <MemoryChart data={series} />
    </div>
  );
}

