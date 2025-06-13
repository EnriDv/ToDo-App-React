import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0D0714] text-white">
      <Navbar />
      <main className="flex-1 p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
