import { useEffect, useRef, useState } from "react";

export function useLiveMetrics(props) {
  const [latest, setLatest] = useState(null);
  const [series, setSeries] = useState([]);
  const {projectkey,servicename} = props;
  console.log("useLiveMetrics Props:", props);
  let url;
  const lastTimestampRef = useRef(null);
  if(!servicename){
    url = `https://api-monitoring-system-szih.onrender.com/resourcedata?`+(projectkey?`projectkey=${projectkey}`:``)
  }else{
    url = `https://api-monitoring-system-szih.onrender.com/resourcedata?`+(projectkey?`projectkey=${projectkey}`:``) + (servicename ? `&servicename=${servicename}` : "");
  }
  console.log("useLiveMetrics Fetch URL:", url);
  useEffect(() => {
    let alive = true;
    async function fetchMetrics() {
      const res = await fetch(url);
      console.log("Fetch response:", res);
      const json = await res.json();
      console.log("Fetched Metrics JSON:", json);
      if (!alive) return;

      setLatest(json);
      if(json.timeSeries){
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
