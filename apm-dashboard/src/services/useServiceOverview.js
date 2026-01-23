import { useEffect, useState } from "react";
export function useServiceOverview(from, to) {
    const [data, setdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    console.log(from)
    console.log(to)
    useEffect(() => {
        let cancelled = false;
        async function fetchMetrics() {
            try {
                setloading(true);
                const actualFrom = from === 0 ? Date.now() - (7 * 24 * 60 * 60 * 1000) : from; 
                const actualTo = to === 0 ? Date.now() : to; 
                const res = await fetch(
                    `https://api-monitoring-system-szih.onrender.com/api/services?from=${actualFrom}&to=${actualTo}`
                );

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `API error: ${res.status}`);
                }

                const json = await res.json();
                if (!cancelled) {
                    setdata(json);
                    seterror(false);
                }
            } catch (e) {
                console.error("Failed to fetch metrics:", e);
                if (!cancelled) seterror(true);
            } finally {
                if (!cancelled) setloading(false);
            }
        }
        fetchMetrics();
        return () => {
            cancelled = true;
        };
    }, [from, to]);
    return { data, loading, error };
}
