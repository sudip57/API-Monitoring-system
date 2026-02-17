import { RefreshCw } from "lucide-react";
import { useAppContext } from "../../context/GlobalAppContext";
const options = [
    { label: "Last 15 minutes", value: 15 },
    { label: "Last 60 minutes", value: 60 },
    { label: "Last 24 hours", value: 1440 },
  ];
const TimeRangePicker = () => {
    const {timeRange} = useAppContext()
    const active = timeRange.rangeMinutes || 15;
    const handleRefresh = (minutes) => {
    timeRange.setRangeMinutes(minutes);
    };
  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-white/[0.03] border border-white/10 rounded-xl p-0.5">
        {options.map((opt) => {
          const isActive = opt.value === active;

          return (
            <button
              key={opt.value}
              onClick={() => handleRefresh(opt.value)}
              className={` cursor-pointer
                px-3 py-1.5 text-[11px] font-medium rounded-lg
                border border-transparent
                transition-colors duration-200 ease-out
                ${isActive
                  ? "bg-violet-600/40 text-violet-200 border-violet-500/40"
                  : "text-white/60 hover:bg-white/5 hover:text-white"}
              `}
            >
              {opt.value === 1440 ? "24h" : `${opt.value}m`}
            </button>
          );
        })}
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => handleRefresh(1)}
        className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors duration-200 cursor-pointer"
      >
        Live
      </button>
    </div>
  );
};

export default TimeRangePicker;
