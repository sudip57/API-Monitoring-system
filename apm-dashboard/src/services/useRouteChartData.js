import { useEffect, useState } from "react";

export function useRouteChartData(config) {
    const {timeRange,serviceName,routeName} = config;
    const [chartdata, setchartdata] = useState(null);
    const [chartloading, setchartloading] = useState(true);
    const [charterror, setcharterror] = useState(false);
    const isLive = timeRange >= 1 && timeRange <= 5;
    useEffect(() => {
        let cancelled = false;
        async function fetchData() {
            try {
                setchartloading(true);
                const range = isLive ? 5 : timeRange;
                const res = await fetch(
                    `https://api-monitoring-system-szih.onrender.com/ranged/metrics/chartData/route?timeRange=${range}&serviceName=${serviceName}&routeName=${routeName}`
                );
                
                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }
                
                const json = await res.json();
                if (!cancelled) {
                    setchartdata(prev => {
                    if (!prev) return json.chartData;
                    const merged = [...prev, ...json.chartData];
                    return merged.slice(-60);
                    });
                    setcharterror(false);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("Error fetching chart data:", err);
                    setcharterror(true);
                }
            } finally {
                if (!cancelled) setchartloading(false);
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
    
    return { chartdata, chartloading, charterror };
}
