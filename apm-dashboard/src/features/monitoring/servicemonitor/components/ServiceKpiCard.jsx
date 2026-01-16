import { useAppContext } from "../../../../context/GlobalAppContext";
import { useNavigate} from "react-router-dom";
function getServiceHealth({ errorRate, totalRequests }) {
  if (totalRequests < 50) {
    return {
      label: "No Data",
      className: "bg-zinc-800 text-zinc-400"
    }
  }

  if (errorRate < 0.1) {
    return {
      label: "Healthy",
      className: "bg-emerald-900/40 text-emerald-400"
    }
  }

  if (errorRate < 0.5) {
    return {
      label: "Degraded",
      className: "bg-yellow-900/40 text-yellow-400"
    }
  }

  if (errorRate < 1) {
    return {
      label: "Unhealthy",
      className: "bg-orange-900/40 text-orange-400"
    }
  }

  return {
    label: "Critical",
    className: "bg-red-900/40 text-red-400"
  }
}

const ServiceKpiCard = ({ service }) => {
  const navigate = useNavigate();
  const {serviceValue,timeRange} = useAppContext();
  const health = getServiceHealth({
          errorRate: service.errorRate,
          totalRequests: service.totalRequests
        })
  return (
    <div  onClick={()=>navigate(`/routes/${service.serviceName}?from=${timeRange.from}&to=${timeRange.to}`)} className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 truncate">
          {service.serviceName}
        </h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${health.className}`}
        >
          {health.label}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-400">Requests</p>
          <p className="text-lg font-bold text-slate-100">
            {service.totalRequests}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Average RPS</p>
          <p className="text-lg font-bold text-slate-100">
            {service.avgThroughputRPS} req/s
          </p>
        </div>
         
        <div>
          <p className="text-xs text-slate-400">Error Rate</p>
          <p className="text-lg font-bold text-red-400">
            {(service.errorRate).toFixed(2)}%
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Avg Latency</p>
          <p className="text-lg font-bold text-slate-100">
            {Number(service.avgLatency).toFixed(2)} ms
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">P95 Latency</p>
          <p className="text-lg font-bold text-slate-100">
            {Array.isArray(service.p95Latency)
              ? service.p95Latency[0]
              : service.p95Latency}{" "}
            ms
          </p>
        </div>
        <button className='  text-slate-200  border rounded-2xl '>View detailed routes</button>
      </div>
       
    </div>
  );
}

export default ServiceKpiCard
