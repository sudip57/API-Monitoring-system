import {
  Activity,
  ShieldCheck,
  Zap,
  Box,
  Clock,
  Hexagon,
  Share2,
  AlertTriangle,
  RefreshCw,
  TriangleAlert,
  Server
} from "lucide-react";
import {useEffect,useState,useRef} from 'react'
import { socket } from "../../../socket/socket";
const LogExplorer = (props) => {
const {serviceName}= props;
const logContainerRef = useRef(null);
const [openSocket, setopenSocket] = useState(false);
const isPinnedToBottomRef = useRef(true);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [logs, setLogs] = useState([])
useEffect(() => {
      if (!socket.connected) socket.connect();
      socket.emit("service-logs", serviceName);
      const handler = (incomingLogs)=>{
        setLogs((prev) => {
          const updated = [...prev,...incomingLogs];
          return updated.slice(-50);
        });
      }
      socket.on("logs-res-by-service", handler);
       return () => {
      socket.off("logs-res-by-service", handler);
    };
    
    },[])
console.log("new logs-----------",logs)
useEffect(() => {
  const container = logContainerRef.current;
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
  return (
    <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-6 min-h-5 ">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                Recent Anomalies
              </h3>
              <button className="text-xs text-violet-400 font-bold hover:underline">
                Full Log Report
              </button>
            </div>

            {/* Hardcoded Log Samples */}
            <div className="space-y-3 max-h-[300px] overflow-auto">
              {logs.map((log, i) => (
                log.level!="info"?(<div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono"
                >
                  <span className="text-zinc-600">{log.timestamp}</span>
                  <span
                    className={
                      log.level === "Critical"
                        ? "text-rose-500"
                        : "text-amber-500"
                    }
                  >
                    [{log.level}]
                  </span>
                  <span className="text-zinc-400">{log.message}</span>
                </div>):null
              ))}
            </div>
          </div>
  )
}

export default LogExplorer
