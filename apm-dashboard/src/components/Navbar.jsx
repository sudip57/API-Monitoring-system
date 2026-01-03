import React, { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const active = "Overview";

  const navItems = ["Overview", "Services", "Errors", "Logs","Alerts"];

  return (
    <header className="
  sticky top-0 z-50
  bg-[#111111]
  border-b border-white/10
">
      {/* Top Bar */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">

        {/* LEFT: Brand + Nav */}
        <div className="flex items-center gap-4 sm:gap-10">
          {/* Mobile menu */}
          <button
            className="sm:hidden text-slate-300 hover:text-white transition"
            onClick={() => setOpen(v => !v)}
          >
            ☰
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
              A
            </div>
            <span className="hidden sm:block text-white font-semibold tracking-wide">
              APM
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:block">
            <ul className="flex items-center gap-6">
              {navItems.map(item => {
                const isActive = item === active;

                return (
                  <li
                    key={item}
                    className="relative cursor-pointer font-medium"
                  >
                    {/* Glow layer */}
                    <span
                        className={`
                            absolute inset-0 select-none
                            text-indigo-400 blur-[8px] transition-opacity duration-200
                            ${
                            isActive
                                ? "opacity-90"
                                : "opacity-0 group-hover:opacity-60"
                            }
                        `}
                        >
                        {item}
                    </span>

                    {/* Actual text */}
                    <span
                      className={`
                        relative text-[15px] transition-colors duration-200
                        ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 hover:text-slate-200"
                        }
                      `}
                    >
                      {item}
                    </span>

                    {/* Active underline */}
                    {isActive && (
                      <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-indigo-500 rounded-full" />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* RIGHT: Account */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right leading-tight">
            <p className="text-xs text-slate-400">Workspace</p>
            <p className="text-sm font-medium text-white">
              Default
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white">
            S
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`
          sm:hidden absolute left-3 top-16 w-[220px] rounded-md
          bg-[#0f172a] border border-white/10 shadow-xl z-50
          transform transition-all duration-200 ease-out
          ${
            open
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }
        `}
      >
        <ul className="py-2">
          {navItems.map(item => {
            const isActive = item === active;

            return (
                <li
                    key={item}
                    onClick={() => setOpen(false)}
                    className="relative px-4 py-2 cursor-pointer"
                    >
                <div className="relative inline-flex items-center">
                        {/* Glow layer */}
                        <span
                        className={`
                            absolute inset-0 flex items-center justify-center
                            text-indigo-400 blur-[7px] transition-opacity duration-200
                            ${isActive ? "opacity-70" : "opacity-0"}
                        `}
                        >
                        {item}
                        </span>

                        {/* Actual text */}
                        <span
                        className={`
                            relative text-sm leading-none transition-colors
                            ${
                            isActive
                                ? "text-white"
                                : "text-slate-300 hover:text-white"
                            }
                        `}
                        >
                        {item}
                        </span>
                </div>
            </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
