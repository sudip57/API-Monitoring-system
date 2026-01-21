import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import './App.css'
import { useTimeRange } from "./services/useTimeRange";
import { AppProvider } from "./context/GlobalAppContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer"
function App() {

  const [rangeMinutes,setRangeMinutes] = useState(1440)
  const {from,to} = useTimeRange(rangeMinutes)
   // ---- Service scope ----
  const [serviceName, setServiceName] = useState(null);
  // ---- Route scope ----
  const [route, setRoute] = useState(null);
  const contextValue = useMemo(
    () => ({
      timeRange: {
        from,
        to,
        rangeMinutes,
        setRangeMinutes,
      },
      serviceValue: {
        serviceName,
        setServiceName,
      },
      routes: {
        route,
        setRoute,
      },
    }),
    [from, to, rangeMinutes,setRangeMinutes, serviceName,setServiceName, route,setRoute]
  );
  return (
    <AppProvider value={contextValue}>
      <Navbar/>
      <main className="w-full bg-gradient-to-b from-[#0a0820] via-[#070707] to-[#071e2e] border-amber-700 overflow-auto">
        <Outlet  />
        <Footer/>
      </main>
    </AppProvider>

  )
}

export default App
