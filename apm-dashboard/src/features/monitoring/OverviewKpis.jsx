import KpiCard from "./components/KpiCard";
import { useOverviewMetrics } from "../../services/useOverviewMetrics";
import { useAppContext } from "../../context/GlobalAppContext";

export default function OverviewKpis() {
  const { timeRange } = useAppContext()
  const { data, loading, error } = useOverviewMetrics(timeRange.rangeMinutes);
  
  return (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
    <KpiCard
      title="Total Requests"
      value={data?.totalRequests}
      loading={loading}
      error={error}
      rangeMinutes={timeRange.rangeMinutes}
    />

    <KpiCard
      title="Error Rate"
      value={data?.errorRate}
      unit="%"
      loading={loading}
      error={error}
      rangeMinutes={timeRange.rangeMinutes}
    />

    <KpiCard
      title="Avg Latency"
      value={data?.avgLatency}
      unit="ms"
      loading={loading}
      error={error}
      rangeMinutes={timeRange.rangeMinutes}
    />

    <KpiCard
      title="P95 Latency"
      value={data?.p95Latency}
      unit="ms"
      loading={loading}
      error={error}
      rangeMinutes={timeRange.rangeMinutes}
    />

    <KpiCard
      title="Throughput"
      value={data?.avgThroughput}
      unit="rps"
      loading={loading}
      error={error}
      rangeMinutes={timeRange.rangeMinutes}
    />
  </div>

  );
}

