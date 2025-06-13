import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { getSupaBaseClient } from "../../supabase-client";

export const EditSheetModal = ({ isOpen, onClose, sheet, onSheetUpdated }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#2E2B3A");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sheet) {
      setName(sheet.name || "");
      setColor(sheet.color || "#2E2B3A");
    }
  }, [sheet]);

  if (!isOpen || !sheet) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    setLoading(true);
    const supabaseTodoClient = getSupaBaseClient("todo");

    try {
      const { data, error } = await supabaseTodoClient
        .from("sheets")
        .update({ name, color })
        .eq("id", sheet.id)
        .single();

      if (error) {
        console.error("Error al actualizar hoja:", error);
      } else {
        onSheetUpdated(data);
        onClose();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1D1825] text-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Editar Hoja
        </h2>

        <input
          type="text"
          placeholder="Nombre de la hoja"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#0D0714] border border-gray-600 text-white placeholder-gray-400"
        />

        <div className="mb-4">
          <button
            onClick={() => setShowColorPicker((v) => !v)}
            className="w-full p-2 rounded bg-[#9E78CF] text-[#0D0714] font-semibold"
          >
            Cambiar Color
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
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#9E78CF] hover:opacity-90 text-[#0D0714] px-4 py-2 rounded font-semibold"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};
