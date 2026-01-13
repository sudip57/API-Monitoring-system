import React from 'react'
import { useState } from 'react'
import OverviewKpis from '../components/OverviewKpis'
import ServiceOverview from '../components/ServiceOverview'
import {useAppContext } from "../context/GlobalAppContext";
import { useOverviewMetrics } from "../scripts/useOverviewMetrics";
import Navbar from '../components/Navbar';
import RequestChartCard from '../components/metricsGraph/RequestChartCard'
import ErrorChartCard from '../components/metricsGraph/ErrorChartCard'
import LatencyChartCard from '../components/metricsGraph/LatencyChartCard'
import ServiceTable from '../components/ServiceTable';
const DashboardPage = () => {
const {timeRange} = useAppContext();
  return (
    <div className='flex flex-col gap-2 p-2'>
    <div className="flex flex-col md:flex-row gap-2 md:gap-3 h-[400px] ">
    <RequestChartCard/>
    <ErrorChartCard/>
    <LatencyChartCard/>
    </div>
    <OverviewKpis/>
    <div>
      <ServiceTable/>
    </div>
    
    {/* <ServiceOverview/> */}
    <button onClick={()=>timeRange.setRangeMinutes(15)} className='p-2 border-2 rounded-2xl text-white'>last 15 min</button>
    <button onClick={()=>timeRange.setRangeMinutes(1440)} className='p-2 border-2 rounded-2xl text-white'>last 24 min</button>
    </div>
  )
}

export default DashboardPage
