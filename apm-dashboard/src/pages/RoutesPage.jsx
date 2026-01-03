import { useEffect, useState } from "react";
import { useParams, useNavigate,useSearchParams } from "react-router-dom";

const RoutesPage = () => {
  const { serviceName } = useParams();
const [searchParams] = useSearchParams();
  const from = Number(searchParams.get("from"));
  const to = Number(searchParams.get("to"));
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutes() {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/routes?serviceName=${serviceName}&from=${from}&to=${to}`
      );

      const data = await res.json();
      console.log(data)
      // IMPORTANT: your response is an array
      const routeData = data.routeData || [];

      // Sort by p95 DESC
      routeData.sort((a, b) => b.p95Latency - a.p95Latency);

      setRoutes(routeData);
      setLoading(false);
    }

    fetchRoutes();
  }, [serviceName,from,to]);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading routes…</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">
        Routes · {serviceName}
      </h2>

      <div className="overflow-x-auto ">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase ">
            <tr>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">Route</th>
              <th className="px-4 py-3 text-right">Requests</th>
              <th className="px-4 py-3 text-right">Avg (ms)</th>
              <th className="px-4 py-3 text-right">P95 (ms)</th>
              <th className="px-4 py-3 text-right">Errors</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {routes.map((r, idx) => {
              const { route, method } = r.routeName;

              const slow = r.p95Latency >= 500;
              const hasErrors = r.errorCount > 0;

              return (
                <tr
                  key={idx}
                  className={`cursor-pointer bg-gray-100 hover:bg-gray-50 ${
                    slow ? "bg-red-50" : ""
                  }`}
                  onClick={() =>
                    navigate(
                      `/routes/${serviceName}/${method}/${encodeURIComponent(
                        route
                      )}`
                    )
                  }
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                      {method}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-mono text-xs">
                    {route}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {r.totalRequests}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {Number(r.avgLatency).toFixed(2)}
                  </td>

                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      slow ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {r.p95Latency}
                  </td>

                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      hasErrors ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {r.errorCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoutesPage;
