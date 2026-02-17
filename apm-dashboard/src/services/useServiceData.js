import { useEffect, useState } from "react";

export function useServiceData(config) {
    const {timeRange,serviceName} = config;
    console.log("inside useServiceData ",serviceName)
    const [data, setdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const s = !serviceName?"":`&serviceName=${serviceName}`
    const params = `timeRange=${timeRange}`+s
    useEffect(() => {
        let cancelled = false;
        
        async function fetchData() {
            try {
                setloading(true);
                const res = await fetch(
                    `https://api-monitoring-system-szih.onrender.com/ranged/metrics/serviceData?${params}`
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
                    console.error("Error fetching service data:", err);
                    seterror(true);
                }
            } finally {
                if (!cancelled) setloading(false);
            }
        }
        
        fetchData();
        if(timeRange>=1 && timeRange<=5){
            const id = setInterval(fetchData, 60000);
            return () => clearInterval(id);
        }
        return () => {
            cancelled = true;
        };
    }, [timeRange]);
    
    return { data, loading, error };
}
