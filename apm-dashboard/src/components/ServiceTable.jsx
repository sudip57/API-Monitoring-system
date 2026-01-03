import React from "react";
import { useAppContext } from "../context/GlobalAppContext";
import {useServiceOverview} from '../scripts/useServiceOverview'
import { useState,useEffect } from "react";
const ServiceTable = () => {
const { timeRange } = useAppContext();
const now = Date.now()
const { data, loading, error } = useServiceOverview(timeRange.from,timeRange.to);
const prevFrom = timeRange.from-30*60*1000;
const prevTo = timeRange.to-15*60*1000
const prevData = useServiceOverview(prevFrom,prevTo);
console.log("prev------",prevData)
console.log("curr-------",data)
const [prevMap, setPrevMap] = useState({});
useEffect(() => {
  if (!prevData.data) return;
  const map = {};
  prevData.data.services.forEach(s => {
    map[s.serviceName] = s;
  });

  setPrevMap(map);
}, [prevData]);

if (!data || data.length === 0) {
    return <div>No service data</div>;
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-200">
          Services Overview
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Health summary of all monitored services
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900/60 text-zinc-400">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Service</th>
              <th className="px-5 py-3 text-right font-medium">Avg Latency</th>
              <th className="px-5 py-3 text-right font-medium">p95 Latency</th>
              <th className="px-5 py-3 text-right font-medium">Error Rate</th>
              <th className="px-5 py-3 text-right font-medium">Throughput</th>
              <th className="px-5 py-3 text-center font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {data.services.map((svc) => (
              <tr
                key={svc.serviceName}
                className="hover:bg-zinc-900/50 transition"
              >
                <td className="px-5 py-4 text-zinc-100 font-medium">
                  {svc.serviceName}
                </td>

                <td className="px-5 py-4 text-right text-zinc-300">
                  {svc.avgLatency}
                </td>

                <td className="px-5 py-4 text-right text-zinc-300">
                  {svc.p95Latency}
                </td>

                <td className="px-5 py-4 text-right text-zinc-300">
                    {svc.errorRate} 
                     {(() => {
                        const prev = prevMap[svc.serviceName];
                        console.log(prev)
                        if (!prev) return null;
                        const currRate = Number(svc.errorRate);
                        const prevRate = Number(prev.errorRate);

                        if (Number.isNaN(currRate) || Number.isNaN(prevRate)) return null;
                        console.log('curRate-------------',currRate)
                        console.log('prevRate-------------',prevRate)
                        const diff = currRate - prevRate;
                        if (diff === 0) return null;
                        console.log('diff----------',diff)
                        const isUp = diff > 0;

                        return (
                        <span
                            className={`ml-2 text-xs ${
                            isUp ? "text-red-400" : "text-green-400"
                            }`}
                        >
                            {isUp ? "↑" : "↓"} {Math.abs(diff).toFixed(2)}%
                        </span>
                        );
                    })()}

                </td>

                <td className="px-5 py-4 text-right text-zinc-300">
                  {svc.throughput}
                </td>

                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${svc.status.className}`}
                  >
                    {svc.status.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceTable;
