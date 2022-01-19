import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`min-h-screen w-full ${darkMode && "dark bg-[#121212]"}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex flex-grow justify-between max-w-7xl mx-auto h-[calc(100vh-5rem)]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
