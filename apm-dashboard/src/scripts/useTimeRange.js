import { useState, useEffect } from "react";
export function useTimeRange(minutes = 15) {
  const [range, setRange] = useState({ from: 0, to: 0 });
  useEffect(() => {
    const now = Date.now();
    setRange({
      from: now - minutes * 60 * 1000,
      to: now,
    });
  }, [minutes]);

  return range;
}
