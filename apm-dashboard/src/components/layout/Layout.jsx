import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false); // only for mobile

  return (
    <div className=" bg-[#0b0b0f] text-white">
      

      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex flex-col sm:ml-64 transition-all duration-300">
        
        <Navbar open={open} setOpen={setOpen} />

        <main className="flex-1 overflow-auto ">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
