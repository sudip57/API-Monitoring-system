import { useEffect, useRef, useState } from "react";

export function useLiveMetrics(props) {
  const [latest, setLatest] = useState(null);
  const [series, setSeries] = useState([]);
  const { projectKey, serviceName } = props;
  const lastTimestampRef = useRef(null);
  
  let url = `https://api-monitoring-system-szih.onrender.com/resourcedata?`;
  if (projectKey) url += `projectKey=${projectKey}`;
  if (serviceName) url += `${projectKey ? '&' : ''}serviceName=${serviceName}`;
  
  useEffect(() => {
    let alive = true;
    
    async function fetchMetrics() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        
        const json = await res.json();
        if (!alive) return;

        // New endpoint structure: { data: [...] }
        const dataArray = json.data || [];
        
        if (dataArray.length > 0) {
          // Set latest to the most recent item
          setLatest(dataArray[dataArray.length - 1]);
          
          // Filter new points based on timestamp
          const newPoints = dataArray.filter(p => {
            const t = new Date(p.timestamp).getTime();
            return !lastTimestampRef.current || t > lastTimestampRef.current;
          });

          if (newPoints.length > 0) {
            lastTimestampRef.current = new Date(
              newPoints[newPoints.length - 1].timestamp
            ).getTime();

            setSeries(prev => {
              const merged = [...prev, ...newPoints];
              // keep last 60 points (sliding window)
              return merged.slice(-60);
            });
          }
        }
      } catch (err) {
        console.error("Error fetching metrics:", err);
      }
    }

    fetchMetrics();
    const id = setInterval(fetchMetrics, 3000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [url]);
  
  return { latest, series };
}

