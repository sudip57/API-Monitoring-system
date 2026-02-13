import OverviewKpis from '../features/monitoring/OverviewKpis'
import RequestChartCard from '../features/monitoring/components/RequestChartCard'
import ErrorChartCard from '../features/monitoring/components/ErrorChartCard'
import LatencyChartCard from '../features/monitoring/components/LatencyChartCard'
import ServiceTable from '../features/monitoring/servicemonitor/ServiceTable'
import ResourceMonitor from '../features/monitoring/resourcemonitor/ResourceMonitor'

const DashboardPage = () => {
  return (
    <div className='flex flex-col gap-[30px] p-4'>

      {/* ===== Header ===== */}
      <div className="flex justify-between items-center">
        <div>
          <h1>System Overview</h1>
        </div>
        <div className="text-sm opacity-70">
          Environment: Production
        </div>
      </div>

      {/* ===== KPI Section ===== */}
      <OverviewKpis/>

      {/* Divider */}
      <div className="h-px bg-gray-700 w-full" />

      {/* ===== Traffic + Services ===== */}
      <div>
        <h2 className="mb-2">Traffic & Services</h2>

        <div className="flex flex-col md:flex-row gap-3 w-full">
          <RequestChartCard/>
          <ServiceTable/>
        </div>
      </div>

      {/* ===== Errors + Latency ===== */}
      <div>
        <h2 className="mb-2">Performance Insights</h2>

        <div className='grid md:grid-cols-2 gap-4'>
          <ErrorChartCard/>
          <LatencyChartCard/>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-700 w-full" />

      {/* ===== Resource Monitoring ===== */}
      <div>
        <h2 className="mb-2">Infrastructure</h2>
        <ResourceMonitor/>
      </div>

      {/* ===== Dummy Activity Feed ===== */}
      <div>
        <h2 className="mb-2">Recent Activity</h2>

        <div className="border rounded p-3 text-sm space-y-2">
          <div>• Service auth-api scaled to 3 instances</div>
          <div>• Spike detected in /checkout endpoint</div>
          <div>• Error rate increased 2% in last 10m</div>
          <div>• Database latency normalized</div>
        </div>
      </div>

      {/* ===== Dummy Status Strip ===== */}
      <div className="flex justify-between text-sm border rounded p-3">
        <div>Uptime: 99.98%</div>
        <div>Active Alerts: 2</div>
        <div>Regions Healthy: 3/4</div>
      </div>

    </div>
  )
}

export default DashboardPage
