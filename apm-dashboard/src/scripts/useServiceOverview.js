import { useEffect, useState } from "react";
export function useServiceOverview(from,to){
    const [data,setdata]=useState(null);
    const [loading,setloading] = useState(true);
    const [error, seterror] = useState(false);
    useEffect(() => {
    let cancelled = false;
    async function fetchMetrics(){
        try{
            setloading(true);
            const res = await fetch(
                `http://localhost:3000/api/services?from=${from}&to=${to}`
            )
            const json = await res.json();
            if(!cancelled){
                setdata(json);
                seterror(false);
            }
        }catch{
              if(!cancelled) seterror(true);
      }finally {
        if (!cancelled) setloading(false);
      }
    
    }
    fetchMetrics();
      return () => {
        cancelled = true;
      }
    }, [from,to])
    return { data, loading, error };
}