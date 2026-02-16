import React, { useEffect,useState } from "react";
import { Activity } from "lucide-react";
const RouteDetailsSection = (props) => {
  const {serviceName} = props
  const routes = [
    {
      time: "14:22:01",
      method: "GET",
      route: "/api/users",
      p95: "210ms",
      err: "0.8%",
    },
    {
      time: "14:21:44",
      method: "POST",
      route: "/api/orders",
      p95: "340ms",
      err: "2.4%",
    },
    {
      time: "14:20:10",
      method: "POST",
      route: "/api/payments",
      p95: "480ms",
      err: "4.1%",
    },
  ];
  const [routeData, setrouteData] = useState(null)
  console.log(serviceName)
  useEffect(() => {
    async function fetchData(){
      const res  = await fetch(`https://api-monitoring-system-szih.onrender.com/ranged/metrics/routeData?timeRange=5&serviceName=${serviceName}`);
      const data = await res.json();
      setrouteData(data.routeData);
    }
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, [serviceName])
  console.log("routeData------------",routeData)
  return (
    <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity size={16} className="text-violet-400" />
          Routes
        </h3>

        <button className="text-xs text-violet-400 font-bold hover:underline">
          Full Route Analytics
        </button>
      </div>

      {/* Route Rows */}
      <div className="space-y-3">
        {routeData?.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <span className="text-zinc-600">{0}</span>

              <span className="text-blue-400">[{r.methodName}]</span>

              <span className="text-zinc-300">{r.routeName}</span>
            </div>

            {/* Right metrics */}
            <div className="flex items-center gap-6">
              <span className="text-zinc-500">
                P95{" "}
                <span className="text-zinc-300 font-semibold">
                  {r.p95Latency}
                </span>
              </span><span className="text-zinc-500">
                AvgLatency{" "}
                <span className="text-zinc-300 font-semibold">
                  {r.avgLatency}
                </span>
              </span>

              <span
                className={
                  parseFloat(r.errorRate) > 2
                    ? "text-rose-500"
                    : "text-amber-500"
                }
              >
                {r.errorRate} ERR
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteDetailsSection;
