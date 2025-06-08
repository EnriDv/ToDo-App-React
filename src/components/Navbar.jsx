import React from 'react';

const Navbar = ({ isAuthenticated }) => {
  return (
    <nav className="bg-[#1D1825] text-[#9E78CF] flex justify-between items-center px-8 py-4">
      <div className="text-lg font-semibold">ToDo App</div>
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
