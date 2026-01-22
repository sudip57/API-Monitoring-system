import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import './App.css'
import { useTimeRange } from "./services/useTimeRange";
import { AppProvider } from "./context/GlobalAppContext";
import Layout from "./components/layout/Layout"
function App() {

  const [rangeMinutes,setRangeMinutes] = useState(1440)
  const {from,to,setRange} = useTimeRange(rangeMinutes)
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
        setRange
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
    [from, to, rangeMinutes,setRangeMinutes, serviceName,setServiceName, route,setRoute,setRange]
  );
  return (
    <AppProvider value={contextValue}>
      <Layout>
        <Outlet  />
      </Layout>
    </AppProvider>

  )
}

export default App
