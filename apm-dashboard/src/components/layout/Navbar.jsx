import { useEffect, useRef, useState } from "react";
import { Clock, ChevronDown, RefreshCw, Menu } from "lucide-react";
import { useAppContext } from "../../context/GlobalAppContext";
import { useTimeSeries } from "../../services/useTimeSeries";

const Navbar = ({ open, setOpen }) => {
  const { timeRange, setTimeRange } = useAppContext();
  const { chartData, loading, error } = useTimeSeries(timeRange.from, timeRange.to);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { label: "Last 15 minutes", value: 15 },
    { label: "Last 60 minutes", value: 60 },
    { label: "Last 24 hours", value: 1440 },
  ];

 const handleRefresh = (minutes) => {
  const now = Date.now();
  const from = now - minutes * 60 * 1000;

  timeRange.setRangeMinutes(minutes); // update minutes
  timeRange.setRange({ from, to: now }); // 🔥 force update range

  setIsMenuOpen(false);
};


  return (
    <header className="h-16 px-3 sm:px-6 flex items-center justify-between bg-[#111111] border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
      
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden p-2 rounded-md hover:bg-white/10 transition"
        >
          <Menu size={20} className="text-slate-300 hover:text-white" />
        </button>

        <h1 className="text-xs sm:text-base font-semibold text-white tracking-wide hidden sm:block">
          Application Performance Monitor
        </h1>
        <h1 className="text-sm font-semibold text-white sm:hidden">
          APM
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Time Filter */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] sm:text-xs text-white/90 hover:bg-white/10 transition"
          >
            <Clock size={12} className="text-violet-400" />
            <span className="hidden sm:inline">
              {options.find((o) => o.value === timeRange.selectedMinutes)?.label.replace(
                "Last ",
                ""
              ) || "Interval"}
            </span>
            <span className="sm:hidden">
              {timeRange.selectedMinutes || 15}m
            </span>
            <ChevronDown size={12} className={`transition ${isMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a24] border border-white/10 rounded-xl shadow-xl py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleRefresh(opt.value)}
                  className="w-full text-left px-4 py-2 text-xs text-white/70 hover:bg-indigo-600 hover:text-white transition flex justify-between"
                >
                  {opt.label}
                  <span className="opacity-40">{opt.value}m</span>
                </button>
              ))}
              <div className="border-t border-white/5 mt-1">
                <button
                  onClick={() => handleRefresh(timeRange.selectedMinutes || 15)}
                  className="w-full px-4 py-2 text-xs text-indigo-400 hover:bg-white/5 flex items-center gap-2"
                >
                  <RefreshCw size={12} /> Refresh Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-sm font-semibold">
          S
        </div>
      </div>
    </header>
  );
};

export default Navbar;
