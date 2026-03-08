import KpiCard from "./components/KpiCard";
import { useOverviewMetrics } from "../../services/useOverviewMetrics";
import { useAppContext } from "../../context/GlobalAppContext";
import { trendFinder } from "../../utils/trendFinder";
export default function OverviewKpis() {
  const { timeRange } = useAppContext()
  const { data, loading, error } = useOverviewMetrics(timeRange.rangeMinutes);
    console.log("data---------",data)
  const {trend} = trendFinder(data);
  console.log("trend---------",trend)
  return (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
    <KpiCard
      title="Total Requests"
      value={data?.totalRequests}
      change={trend?.totalRequests}
      loading={loading}
      error={error}
      rangeMinutes={timeRange.rangeMinutes}
    />

    <KpiCard
      title="Error Rate"
      value={data?.errorRate}
      unit="%"
      change={trend?.errorRate}
      loading={loading}
      error={error}
      rangeMinutes={timeRange.rangeMinutes}
    />

    <KpiCard
      title="Avg Latency"
      value={data?.avgLatency}
      unit="ms"
      change={trend.latency}
      loading={loading}
      error={error}
      rangeMinutes={timeRange.rangeMinutes}
    />

    {/* <KpiCard
      title="P95 Latency"
      value={data?.p95Latency}
      change={trend.p95Latency}
      unit="ms"
      loading={loading}
      error={error}
      rangeMinutes={timeRange.rangeMinutes}
    />

    <KpiCard
      title="Throughput"
      value={data?.avgThroughPut}
      unit="rps"
      change={trend.rps}
      loading={loading}
      error={error}
      rangeMinutes={timeRange.rangeMinutes}
    /> */}
  </div>

  );
}

