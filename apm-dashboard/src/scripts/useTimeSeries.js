import { useEffect, useState } from "react";
export function useTimeSeries(from,to){
    console.log("form----------",from)
    console.log("to----",to)
    const [chartData,setchartData]=useState(null);
    const [loading,setloading] = useState(true);
    const [error, seterror] = useState(false);
    useEffect(() => {
      let cancelled = false;
      async function fetchMetrics(){
        try{
            setloading(true);
            const res = await fetch(
                `https://api-monitoring-system.vercel.app/api/timeSeries?from=${from}&to=${to}`
            )
            const json = await res.json();
            if(!cancelled){
                setchartData(json);
                seterror(false);
            }
        }catch{
              if (!cancelled) seterror(true);
      }finally {
        if (!cancelled) setloading(false);
      }
    
    }
    fetchMetrics();
      return () => {
        cancelled = true;
      }
    }, [from,to])
    return { chartData, loading, error };
}