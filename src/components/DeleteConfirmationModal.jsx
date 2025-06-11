import React from "react";
import ReactDOM from "react-dom";

export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-[#1D1A27] p-6 rounded-lg w-full max-w-md text-white z-[10000]"
        onClick={e => e.stopPropagation()}
      >
        <p className="mb-6 text-center">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
