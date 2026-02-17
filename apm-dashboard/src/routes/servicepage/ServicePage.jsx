import { useState } from "react";
import { useAppContext } from "../../context/GlobalAppContext";
import { useServiceData } from "../../services/useServiceData";
import TimeRangePicker from "../../components/ui/TimeRangePicker";
import {
  Search,
  RefreshCw,
} from "lucide-react";
import ServiceCard from "./components/ServiceCard";
const ServicePage = () => {
  const { timeRange } = useAppContext();
  const { data, loading, error } = useServiceData({
    timeRange: timeRange.rangeMinutes,
  });
  const services = data?.servicesData || [];
  if (loading && !data) {
    return (
      <div className="w-full h-80 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse flex flex-col items-center justify-center gap-4">
        <RefreshCw size={24} className="animate-spin text-violet-500/40" />
        <div className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-bold">
          Mapping Service Topology
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 p-8 font-sans">
      {/* Header & Global Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Service Directory
          </h1>
          <p className="text-zinc-500 mt-2 flex items-center gap-2">
            Monitoring{" "}
            <span className="text-violet-400 font-bold">{services.length}</span>{" "}
            active services
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, team, or tag..."
              className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
            />
          </div>
          <TimeRangePicker />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <ServiceCard svc={svc}/>
        ))}
      </div>
    </div>
  );
};

export default ServicePage;
