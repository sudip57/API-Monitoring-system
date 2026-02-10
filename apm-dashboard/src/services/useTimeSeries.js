// import { useEffect, useState } from "react";
// export function useTimeSeries(from, to) {
//     const [chartData, setchartData] = useState(null);
//     const [loading, setloading] = useState(true);
//     const [error, seterror] = useState(false);
//     useEffect(() => {
//         let cancelled = false;
//         async function fetchMetrics() {
//             if (from === 0 && to === 0) { 
//                 setloading(false); 
//                 seterror(false); 
//                 return; 
//             }
//             try {
//                 setloading(true);
//                 const res = await fetch(
//                     `https://api-monitoring-system-szih.onrender.com/api/timeSeries?from=${from}&to=${to}`
//                 );

//                 if (!res.ok) {
//                     throw new Error(`HTTP error! status: ${res.status}`);
//                 }

//                 const json = await res.json();
//                 if (!cancelled) {
//                     setchartData(json);
//                     seterror(false);
//                 }
//             } catch (e) { 
//                 console.error("Failed to fetch metrics:", e); 
//                 if (!cancelled) seterror(true);
//             } finally {
//                 if (!cancelled) setloading(false);
//             }
//         }
//         fetchMetrics();
//         return () => {
//             cancelled = true;
//         }
//     }, [from, to]); // Dependency array to re-run effect when from or to change
//     return { chartData, loading, error };
// }
