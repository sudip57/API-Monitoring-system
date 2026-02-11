import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ServicePage from "./routes/ServicePage";
import RoutesPage from './routes/RoutesPage';
import ErrorAnalysisPage from './routes/ErrorAnalysisPage';
import LogExplorerPage from './routes/LogExplorerPage';
import './index.css'
import App from './App'
import DashboardPage from './routes/DashboardPage';
import ServiceDetailPage from './routes/ServiceDetailPage';
import AlertPage from './routes/AlertPage';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<DashboardPage/>} />
        <Route path="/services">
          <Route index element={<ServicePage />} />
          <Route path=":serviceName" element={<ServiceDetailPage/>} />
          </Route>
          <Route path="routes" element={<RoutesPage/>} />
          <Route path="errors" element={<ErrorAnalysisPage/>} />
          <Route path="logs" element={<LogExplorerPage/>} />
          <Route path="alerts" element={<AlertPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
)
