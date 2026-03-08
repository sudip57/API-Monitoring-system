import { useEffect, useState, useRef } from "react";
import { socket } from "../../socket/socket";
import {
  ChevronRight,
  Terminal,
  Filter,
  Search,
  ArrowUpRight,
  ShieldX,
  Bug
} from "lucide-react";

const ErrorAnalysisPage = () => {
  const [errors, setErrors] = useState([]);
  const roomId = "errors";
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("errors-req-service", roomId);

    const handler = (incomingErrors) => {
      setErrors((prev) => {
        const updated = [...prev, ...incomingErrors];
        return updated.slice(-500);
      });
    };

    socket.on("errors-res-service", handler);

    return () => {
      socket.off("errors-res-service", handler);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth"
    });
  }, [errors]);

  return (
    <div className="h-screen bg-[#050508] text-zinc-300 p-8 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
            <ShieldX size={24} className="text-rose-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">Error Analysis</h1>
            <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">
              Real-time Error Stream
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-zinc-500 uppercase font-black">
            Total Errors
          </p>
          <p className="text-xl font-bold text-rose-400">{errors.length}</p>
        </div>
      </div>
      <div className="flex gap-3 mb-6 shrink-0">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
          <input
            placeholder="Search by exception, message, service..."
            className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-rose-500/40"
          />
        </div>

        <button className="h-11 px-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] flex items-center gap-2 text-xs font-bold uppercase">
          <Filter size={16} />
          Filters
        </button>
      </div>
      <div className="flex-1 min-h-0 bg-[#0c0c12] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        <div className="flex text-[10px] uppercase tracking-[0.2em] text-zinc-500 bg-white/[0.02] border-b border-white/5 py-3 px-6 font-black shrink-0">
          <div className="flex-1">Exception</div>
          <div className="w-40 text-center">Service</div>
          <div className="w-48 text-right">Timestamp</div>
          <div className="w-16"></div>
        </div>
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto font-mono text-[12px]"
        >
          {errors.map((err) => (
            <div
              key={err._id}
              className="flex items-center border-b border-white/[0.02] hover:bg-white/[0.02] py-3 px-6"
            >
              <div className="flex-1 flex items-center gap-3">
                <Bug size={16} className="text-rose-400" />
                <div className="flex flex-col">
                  <span className="text-zinc-200 font-medium">
                    {err.message}
                  </span>

                  <span className="text-[10px] text-zinc-500 flex items-center gap-2">
                    <Terminal size={10} />
                    {err.meta?.serviceName || "unknown-service"} • {err.method}{" "}
                    {err.url}
                  </span>
                </div>
              </div>
              <div className="w-40 text-center text-violet-400 font-bold">
                {err.meta?.serviceName}
              </div>
              <div className="w-48 text-right text-zinc-500">
                {new Date(err.timestamp).toLocaleTimeString()}
              </div>

              <div className="w-16 text-right">
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-violet-600 transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-white/[0.01] border-t border-white/5 flex justify-between items-center shrink-0">
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            Showing last {errors.length} errors
          </span>
          <div className="flex items-center gap-1 text-[10px] text-violet-400 font-black uppercase cursor-pointer">
            Load More <ArrowUpRight size={12} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ErrorAnalysisPage;