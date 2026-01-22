import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ open, setOpen }) => {
  const navMap = {
    Dashboard: "/",
    Services: "/services",
    Errors: "/errors",
    Logs: "/logs",
    Alerts: "/alerts",
  };

  const navItems = ["Dashboard", "Services", "Errors", "Logs", "Alerts"];
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

<aside
  className={`
    fixed top-0 left-0 h-screen w-64
    bg-[#111111] border-r border-white/10
    transform transition-all duration-300 z-50
    -translate-x-full sm:translate-x-0
    ${open ? "translate-x-0" : ""}
    flex flex-col
  `}
>

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-md bg-indigo-600 flex items-center justify-center font-bold">
            A
          </div>
          <span className="ml-3 font-semibold tracking-wide">APM</span>
        </div>

        {/* Nav */}
        <ul className="px-3 py-4 space-y-1 flex-1 overflow-y-auto">
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
                {item}
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
