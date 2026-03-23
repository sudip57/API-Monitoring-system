import { useEffect, useState, useRef } from "react";
import { socket } from "../../socket/socket";
import TimeRangePicker from "../../components/ui/TimeRangePicker";
import { useAppContext } from "../../context/GlobalAppContext";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  ChevronRight,
  Terminal,
  Play,
  Pause,
  Filter,
  Search,
  ArrowUpRight,
  ShieldX,
  Bug,
} from "lucide-react";

const ErrorAnalysisPage = () => {
  const { timeRange } = useAppContext();
  const errorContainerRef = useRef(null);
  const [openSocket, setopenSocket] = useState(false);
  const isPinnedToBottomRef = useRef(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const socketHandler = (toggle) => {
    if (toggle === "on") {
      setopenSocket(true);
      console.log("toggle on");
    } else if (toggle === "off") {
      setopenSocket(false);
    }
  };
  const [errors, setErrors] = useState([]);
  const roomId = "errors";
  const fetchErrors = async () => {
    const res = await fetch(
      `https://api-monitoring-system-szih.onrender.com/ranged/metrics/Errors?timeRange=${timeRange.rangeMinutes}&page=${page}&limit=50`,
    );
    const data = await res.json();
    setErrors((prev) => [...prev, ...data.errors]);
    setHasMore(data.hasMore);
  };
  useEffect(() => {
    setErrors([]);
    setopenSocket(false);
    setPage(1);
    setHasMore(true);
  }, [timeRange]);

  useEffect(() => {
    fetchErrors();
  }, [page, timeRange]);

  useEffect(() => {
    if (!openSocket) {
      socket.disconnect();
      return;
    }
    setErrors([]);

    if (!socket.connected) socket.connect();
    socket.emit("Errors-req-service", roomId);
    const handler = (incomingErrors) => {
      setErrors((prev) => {
        const updated = [...prev, ...incomingErrors];
        return updated.slice(-500);
      });
    };
    socket.on("Errors-res-service", handler);
    return () => {
      socket.off("Errors-res-service", handler);
    };
  }, [openSocket]);

useEffect(() => {
  const container = errorContainerRef.current;
  if (!container) return;
  const handleScroll = () => {
    const threshold = 80;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

    isPinnedToBottomRef.current = isNearBottom;
  };
  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, []);

  useEffect(() => {
    if (!openSocket) return;
    const container = errorContainerRef.current;
    if (!container) return;
    if (isPinnedToBottomRef.current) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [errors, openSocket]);
  
  useEffect(() => {
    if (!openSocket) {
      socket.disconnect();
      return;
    }
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
  }, [openSocket]);

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
        <div className="text-right flex gap-5 justify-center items-center">
          <TimeRangePicker />
          <div className="flex bg-white/[0.03] border border-white/10 rounded-xl p-1">
            <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
              <Play
                size={16}
                fill="currentColor"
                onClick={() => {
                  socketHandler("on");
                }}
              />
            </button>
            <button className="p-2 rounded-lg text-zinc-500 hover:text-white transition-all">
              <Pause
                size={16}
                fill="currentColor"
                onClick={() => {
                  socketHandler("off");
                }}
              />
            </button>
          </div>
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
          id="error-scroll-container" ref={errorContainerRef}
          className="flex-1 min-h-0 overflow-y-auto font-mono text-[12px]"
        >
          <InfiniteScroll
                      dataLength={errors.length}
                      next={() =>!openSocket&&setPage(prev => prev + 1)}
                      hasMore={hasMore}
                      loader={<div className="p-4 text-center text-zinc-500">Loading errors...</div>}
                      endMessage={<p>No more data</p>}
                      scrollableTarget="error-scroll-container"
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
          </InfiniteScroll>
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
