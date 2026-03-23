import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home,Bug,Logs,LayoutGrid,AlertCircle,Route} from "lucide-react";
const Sidebar = ({ open, setOpen }) => {
  const navMap = {
    Dashboard: "/",
    Services: "/services",
    Routes: "/routes",
    Errors: "/errors",
    Logs: "/logs",
    Alerts: "/alerts",
    
  };
  const navIcon = {
    Dashboard: <Home/>,
    Services: <LayoutGrid/>,
    Routes: <Route/>,
    Errors: <Bug/>,
    Logs: <Logs/>,
    Alerts: <AlertCircle/>,
  }
  const navItems = ["Dashboard", "Services","Routes", "Errors","Logs", "Alerts"];
  const navigate = useNavigate();
  const location = useLocation(); // auto active route

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
        />
      )}

        <div
          className={`
          fixed top-0 left-0 h-screen w-18
          bg-[#111111] border-r border-white/10
          transform transition-all duration-300 z-50
          -translate-x-full sm:translate-x-0
          ${open ? "translate-x-0" : ""}
          flex flex-col
        `}
        >

        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <div className="p-2 rounded-md bg-indigo-600 flex items-center justify-center font-bold">
            APM
          </div>
        </div>

        {/* Nav */}
        <ul className="px-1 py-4  flex flex-col items-center justify-center overflow-y-auto gap-5 overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === navMap[item];

            return (
              <li
                key={item}
                onClick={() => {
                  navigate(navMap[item]);
                  setOpen(false);
                }}
                className={`
                  px-4 py-2 rounded-lg cursor-pointer transition
                  ${
                    isActive
                      ? "bg-indigo-600/20 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                {navIcon[item]}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
