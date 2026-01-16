import React from 'react'
import { useState } from 'react'
import OverviewKpis from '../features/monitoring/OverviewKpis'
import ServiceOverview from '../features/monitoring/servicemonitor/ServiceOverview'
import {useAppContext } from "../context/GlobalAppContext";
import { useOverviewMetrics } from "../services/useOverviewMetrics";
import Navbar from '../components/layout/Navbar';
import RequestChartCard from '../features/monitoring/components/RequestChartCard'
import ErrorChartCard from '../features/monitoring/components/ErrorChartCard'
import LatencyChartCard from '../features/monitoring/components/LatencyChartCard'
import ServiceTable from '../features/monitoring/servicemonitor/ServiceTable';
import ResourceMonitor from '../features/monitoring/resourcemonitor/ResourceMonitor';
const DashboardPage = () => {
const {timeRange} = useAppContext();
  return (
    <div className='flex flex-col gap-[30px] p-2'>
    <div className="flex flex-col md:flex-row gap-2 md:gap-3 h-[400px] ">
    <RequestChartCard/>
    <ErrorChartCard/>
    <LatencyChartCard/>
    </div>
    
    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
      <div className='flex flex-col gap-4'>
        <OverviewKpis/>
        <ServiceTable/>
      </div>
      <ResourceMonitor/>
    </div>
    
    {/* <ServiceOverview/> */}
    <button onClick={()=>timeRange.setRangeMinutes(15)} className='p-2 border-2 rounded-2xl text-white'>last 15 min</button>
    <button onClick={()=>timeRange.setRangeMinutes(1440)} className='p-2 border-2 rounded-2xl text-white'>last 24 min</button>
    </div>
  )
}

export default DashboardPage
