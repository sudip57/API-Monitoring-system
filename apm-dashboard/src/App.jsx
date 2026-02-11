import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import './App.css'
import { AppProvider } from "./context/GlobalAppContext";
import Layout from "./components/layout/Layout"

function App() {
  const [rangeMinutes, setRangeMinutes] = useState(1440)
  const [serviceName, setServiceName] = useState(null);
  const [route, setRoute] = useState(null);
  
  const contextValue = useMemo(
    () => ({
      timeRange: {
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
    [rangeMinutes, setRangeMinutes, serviceName, setServiceName, route, setRoute]
  );
  
  return (
    <AppProvider value={contextValue}>
      <Layout>
        <Outlet />
      </Layout>
    </AppProvider>
  )
}

export default App
