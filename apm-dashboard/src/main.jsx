import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ServicePage from "./routes/ServicePage";
import './index.css'
import App from './App'
import DashboardPage from './routes/DashboardPage';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<DashboardPage/>} />
          <Route path="services" element={<ServicePage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
