import { useEffect, useState } from "react";

export function useOverviewMetrics(timeRange){
    const [data, setdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    
    useEffect(() => {
      let cancelled = false;
      
      async function fetchMetrics(){
        try{
            setloading(true);
            const res = await fetch(
                `https://api-monitoring-system-szih.onrender.com/ranged/metrics/stats?timeRange=${timeRange}`
            )
            console.log(res)
            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }
            const json = await res.json();
            if(!cancelled){
                setdata(json.overviewData);
                seterror(false);
            }
        } catch(err){
            if (!cancelled) {
                console.error("Error fetching metrics:", err);
                seterror(true);
            }
        } finally {
            if (!cancelled) setloading(false);
        }
      }
      
      fetchMetrics();
      
      return () => {
        cancelled = true;
      }
    }, [timeRange])
    
    return { data, loading, error };
}
