import { useEffect, useState } from "react";

export function useChartData(timeRange) {
    const [data, setdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    
    useEffect(() => {
        let cancelled = false;
        
        async function fetchData() {
            try {
                setloading(true);
                const res = await fetch(
                    `https://api-monitoring-system-szih.onrender.com/ranged/metrics/chartData?timeRange=${timeRange}`
                );
                
                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }
                
                const json = await res.json();
                if (!cancelled) {
                    setdata(json);
                    seterror(false);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("Error fetching chart data:", err);
                    seterror(true);
                }
            } finally {
                if (!cancelled) setloading(false);
            }
        }
        
        fetchData();
        
        return () => {
            cancelled = true;
        };
    }, [timeRange]);
    
    return { data, loading, error };
}
