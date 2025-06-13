// src/components/categories/CreateCategoryModal.jsx
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { getSupaBaseClient } from "../../supabase-client";
import { useParams } from "react-router-dom";

export function CreateCategoryModal({ isOpen, onClose, onCreated }) {
  const { id: sheet_id } = useParams();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#FFFFFF");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("El nombre no puede estar vacío.");
      return;
    }
    setLoading(true);
    const supabase = getSupaBaseClient("todo");
    const payload = { sheet_id, name, color };

    const { data, error } = await supabase
      .from("categories")
      .insert([payload])
      .single();

    setLoading(false);
    if (error) {
      console.error("Error al crear categoría:", error);
    } else {
      onCreated(data);
      onClose();
      setName("");
      setColor("#FFFFFF");
      setShowColorPicker(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1D1825] text-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Crear nueva Categoría
        </h2>

        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#0D0714] border border-gray-600 text-white placeholder-gray-400"
        />

        <div className="mb-4">
          <button
            onClick={() => setShowColorPicker((v) => !v)}
            className="w-full p-2 rounded bg-[#9E78CF] text-[#0D0714] font-semibold"
          >
            Seleccionar Color
          </button>
          {showColorPicker && (
            <div className="mt-2">
              <SketchPicker
                color={color}
                onChangeComplete={(c) => setColor(c.hex)}
                disableAlpha
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              onClose();
              setName("");
              setColor("#FFFFFF");
              setShowColorPicker(false);
            }}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-[#9E78CF] hover:opacity-90 text-[#0D0714] px-4 py-2 rounded font-semibold"
          >
            {loading ? "Creando..." : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
