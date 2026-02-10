import { useEffect, useState } from "react";

export function useRouteData(timeRange, serviceName = null) {
    const [data, setdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    
    useEffect(() => {
        let cancelled = false;
        
        async function fetchData() {
            try {
                setloading(true);
                let url = `https://api-monitoring-system-szih.onrender.com/ranged/metrics/routeData?timeRange=${timeRange}`;
                
                if (serviceName) {
                    url += `&serviceName=${serviceName}`;
                }
                
                const res = await fetch(url);
                
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
                    console.error("Error fetching route data:", err);
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
    }, [timeRange, serviceName]);
    
    return { data, loading, error };
}
