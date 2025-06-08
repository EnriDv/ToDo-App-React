import React from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 z-50 transition-all ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="relative w-64 h-full bg-[#1D1825] text-[#9E78CF] shadow-lg px-6 py-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl">✕</button>
        <h2 className="text-xl font-semibold mb-6">Menú</h2>
        <button className="w-full bg-[#9E78CF] text-[#0D0714] py-2 px-4 mb-4 rounded hover:opacity-90 transition">
          Crear nueva hoja
        </button>
        <button className="w-full bg-[#9E78CF] text-[#0D0714] py-2 px-4 rounded hover:opacity-90 transition">
          Crear nueva categoría
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
