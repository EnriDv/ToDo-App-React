import React from 'react';

const Navbar = ({ isAuthenticated, onMenuClick }) => {
  return (
    <nav className="bg-[#1D1825] text-[#9E78CF] flex justify-between items-center px-8 py-4 border-b border-[#9E78CF]">
      <div className="flex items-center space-x-4">
        <button onClick={onMenuClick} className="text-2xl focus:outline-none">☰</button>
        <div className="text-lg font-semibold">ToDo App</div>
      </div>
      <div>
        {isAuthenticated ? (
          <div className="text-2xl">👤</div>
        ) : (
          <button className="bg-[#9E78CF] text-[#0D0714] font-semibold px-4 py-2 rounded hover:opacity-90 transition">
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
