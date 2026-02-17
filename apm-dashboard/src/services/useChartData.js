import { useEffect, useState } from "react";

export function useChartData(timeRange) {
    const [data, setdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const isLive = timeRange >= 1 && timeRange <= 5;
    useEffect(() => {
        let cancelled = false;
        async function fetchData() {
            try {
                setloading(true);
                const range = isLive ? 5 : timeRange;
                const res = await fetch(
                    `https://api-monitoring-system-szih.onrender.com/ranged/metrics/chartData?timeRange=${range}`
                );
                
                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }
                
                const json = await res.json();
                if (!cancelled) {
                    setdata(prev => {
                    if (!prev) return json.chartData;
                    const merged = [...prev, ...json.chartData];
                    return merged.slice(-60);
                    });
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
        if(isLive){
            const id = setInterval(fetchData, 60000);
            return () => clearInterval(id);
        }
        return () => {
            cancelled = true;
        };
    }, [timeRange]);
    
    return { data, loading, error };
}
