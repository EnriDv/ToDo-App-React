import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from '../context/AuthContext.jsx';


const Navbar = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      // await signOut();
      navigate("/");
    } catch (err) {
      console.error("An unexpected error occurred.", err); // Catch unexpected errors
    }
  };

  return (
    <nav className="bg-[#1D1825] text-[#9E78CF] flex justify-between items-center px-8 py-4">
      <div className="flex items-center space-x-4">
        <Link to="/home" className="text-lg font-semibold">ToDo App</Link>
      </div>
      <h2>Welcome, {session?.user?.email}</h2>
      <div>
        <button 
          onClick={handleSignOut} 
          className="bg-[#9E78CF] text-[#0D0714] font-semibold px-4 py-2 rounded hover:opacity-90 hover:cursor-pointer transition"
        >
          Cerrar Sesion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
