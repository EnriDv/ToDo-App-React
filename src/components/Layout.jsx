import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import Sidebar from './Sidebar.jsx';

const Layout = ({ isAuthenticated, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0714] text-white">
      <Navbar isAuthenticated={isAuthenticated} onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
