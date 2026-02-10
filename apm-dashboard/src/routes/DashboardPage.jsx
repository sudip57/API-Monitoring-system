import OverviewKpis from '../features/monitoring/OverviewKpis'
import {useAppContext } from "../context/GlobalAppContext";
import RequestChartCard from '../features/monitoring/components/RequestChartCard'
import ErrorChartCard from '../features/monitoring/components/ErrorChartCard'
import LatencyChartCard from '../features/monitoring/components/LatencyChartCard'
import ServiceTable from '../features/monitoring/servicemonitor/ServiceTable';
import ResourceMonitor from '../features/monitoring/resourcemonitor/ResourceMonitor';
const DashboardPage = () => {
const {timeRange} = useAppContext();
  return (
    <div className='flex flex-col gap-[30px] p-4 '>
    <OverviewKpis/>
    <div className="flex flex-col md:flex-row gap-2 md:gap-3">
      <RequestChartCard/>
      <ServiceTable/>
    </div>
    <div className='grid md:grid-cols-2 gap-4'>
        <ErrorChartCard/>
        <LatencyChartCard/>
    </div>
    <ResourceMonitor/>
    </div>
  )
}

export default DashboardPage
