import { useState ,useEffect,useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/GlobalAppContext"
import { useTimeSeries } from '../../services/useTimeSeries'
import { Activity, ChevronDown, Clock, RefreshCw } from 'lucide-react'
const Navbar = () => {
  const navMap = {
  Dashboard: "/",
  Services: "/services",
  Errors: "/errors",
  Logs: "/logs",
  Alerts: "/alerts"
};
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState();
  const navItems = ["Dashboard", "Services", "Errors", "Logs","Alerts"];
  const navigate = useNavigate();
    const { timeRange, setTimeRange } = useAppContext()
    const { chartData, loading, error } = useTimeSeries(timeRange.from, timeRange.to)
    
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef(null)
   useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsMenuOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
  
    const options = [
      { label: 'Last 15 minutes', value: 15 },
      { label: 'Last 60 minutes', value: 60 },
      { label: 'Last 24 hours', value: 1440 },
    ]
  
    const handleRefresh = (minutes) => {
      const now = Date.now()
      const from = now - (minutes * 60 * 1000)
      timeRange.setRangeMinutes(minutes)
      if (setTimeRange) {
        setTimeRange({ from, to: now })
      }
      setIsMenuOpen(false)
    }
  return (
    <header className="
  sticky top-0 z-50
  bg-[#111111]
  border-b border-white/10
">
      {/* Top Bar */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">

        {/* LEFT: Brand + Nav */}
        <div className="flex items-center gap-4 sm:gap-10">
          {/* Mobile menu */}
          <button
            className="sm:hidden text-slate-300 hover:text-white transition"
            onClick={() => setOpen(v => !v)}
          >
            ☰
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
              A
            </div>
            <span className="hidden sm:block text-white font-semibold tracking-wide">
              APM
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:block">
            <ul className="flex items-center gap-6">
              {navItems.map(item => {
                const isActive = item === active;
                return (
                  <li
                    key={item}
                    onClick={() => {
                      setActive(item)
                      navigate(navMap[item])
                    }}
                    className="relative cursor-pointer font-medium"
                  >
                    <span
                        className={`
                            absolute inset-0 select-none
                            text-indigo-400 blur-[8px] transition-opacity duration-200
                            ${
                            isActive
                                ? "opacity-90"
                                : "opacity-0 group-hover:opacity-60"
                            }
                        `}
                        >
                        {item}
                    </span>
                    <span
                      className={`
                        relative text-[15px] transition-colors duration-200
                        ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 hover:text-slate-200"
                        }
                      `}
                    >
                      {item}
                    </span>
                    {isActive && (
                      <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-indigo-500 rounded-full" />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
       
        <div className="flex items-center gap-3">
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] md:text-[11px] font-medium text-white/90 hover:bg-white/10 transition-all"
          >
            <Clock size={12} className="text-violet-400" />
            <span>{options.find(o => o.value === timeRange.selectedMinutes)?.label.replace('Last ', '') || 'Interval'}</span>
            <ChevronDown size={12} className={isMenuOpen ? 'rotate-180' : ''} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl py-1 z-50 overflow-hidden backdrop-blur-xl">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleRefresh(opt.value)}
                  className="w-full text-left px-4 py-2.5 text-[11px] text-white/70 hover:bg-violet-600 hover:text-white transition-colors flex justify-between items-center"
                >
                  {opt.label}
                  <span className="text-[9px] opacity-40">{opt.value}m</span>
                </button>
              ))}
              <div className="border-t border-white/5 mt-1">
                <button 
                  onClick={() => handleRefresh(timeRange.selectedMinutes || 15)}
                  className="w-full text-left px-4 py-2 text-[10px] text-violet-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={10} />Refresh Now
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="hidden sm:block text-right leading-tight">
            <p className="text-xs text-slate-400">Workspace</p>
            <p className="text-sm font-medium text-white">
              Default
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white">
            S
          </div>
        </div>
      </div>

      <div
        className={`
          sm:hidden absolute left-3 top-16 w-[220px] rounded-md
          bg-[#0f172a] border border-white/10 shadow-xl z-50
          transform transition-all duration-200 ease-out
          ${
            open
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }
        `}
      >
        <ul className="py-2">
          {navItems.map(item => {
            const isActive = item === active;

            return (
                <li
                    key={item}
                    onClick={() => setOpen(false)}
                    className="relative px-4 py-2 cursor-pointer"
                    >
                <div className="relative inline-flex items-center">
                        <span
                        className={`
                            absolute inset-0 flex items-center justify-center
                            text-indigo-400 blur-[7px] transition-opacity duration-200
                            ${isActive ? "opacity-70" : "opacity-0"}
                        `}
                        >
                        {item}
                        </span>

                        <span
                        className={`
                            relative text-sm leading-none transition-colors
                            ${
                            isActive
                                ? "text-white"
                                : "text-slate-300 hover:text-white"
                            }
                        `}
                        >
                        {item}
                        </span>
                </div>
            </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
