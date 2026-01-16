import { useEffect, useRef, useState } from "react";

export function LiveMetrics(props) {
  const [latest, setLatest] = useState(null);
  const [series, setSeries] = useState([]);

  const lastTimestampRef = useRef(null);

  useEffect(() => {
    let alive = true;
    async function fetchMetrics() {
      const res = await fetch(`https://api-monitoring-system-szih.onrender.com/resourceMetrics`);
      console.log("Fetch response:", res);
      const json = await res.json();
      if (!alive) return;

      setLatest(json);

      const newPoints = json.timeSeries.filter(p => {
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

    fetchMetrics();
    const id = setInterval(fetchMetrics, 3000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  console.log("LiveMetrics Hook - Latest:", series);
  return { latest, series };
}
