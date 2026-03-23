import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false); // only for mobile

  return (
    <div className=" bg-[#0b0b0f] text-white">
      
      <Navbar open={open} setOpen={setOpen} />

      <div className="flex flex-col transition-all duration-300">
        <Sidebar open={open} setOpen={setOpen} />
        <div>
        <main className="flex-1 sm:ml-18 overflow-auto ">
          {children}
        </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
