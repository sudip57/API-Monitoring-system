import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoutesPage from "./pages/RoutesPage";
import './index.css'
import App from './App'
import DashboardPage from './pages/DashboardPage';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<DashboardPage/>} />
          <Route path='routes/:serviceName' element={<RoutesPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
