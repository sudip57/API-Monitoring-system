import KpiCard from "./KpiCard";
import { useOverviewMetrics } from "../scripts/useOverviewMetrics";
import { useAppContext } from "../context/GlobalAppContext";
export default function OverviewKpis() {
  const { timeRange } = useAppContext()
  const { data, loading, error } = useOverviewMetrics(timeRange.from, timeRange.to);
  return (
  <div className="flex flex-wrap gap-3 m-2 justify-around">
    <KpiCard
      title="Total Requests"
      value={data?.totalRequests}
      loading={loading}
      error={error}
    />

    <KpiCard
      title="Error Rate"
      value={data?.errorRate}
      unit="%"
      loading={loading}
      error={error}
    />

    <KpiCard
      title="Avg Latency"
      value={data?.avgLatency}
      unit="ms"
      loading={loading}
      error={error}
    />

    <KpiCard
      title="Avg p95 Latency"
      value={data?.p95Latency}
      unit="ms"
      loading={loading}
      error={error}
    />

    <KpiCard
      title="Throughput"
      value={data?.avgThroughputRPS}
      unit="rps"
      loading={loading}
      error={error}
    />
  </div>

  );
}
