import { useState, useEffect } from "react";
export function useTimeRange(minutes = 15) {
  const [range, setRange] = useState();
  useEffect(() => {
    setRange(minutes);
  }, [minutes]);
  return { ...range, setRange };
}
