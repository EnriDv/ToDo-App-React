// components/categories/EditCategoryModal.jsx
import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { categoryRepository } from "../../services/CategoryRepository";

export const EditCategoryModal = ({ isOpen, onClose, category, onUpdated }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#2E2B3A");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setColor(category.color || "#2E2B3A");
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    setLoading(true);

    try {
      const updatedCategory = await categoryRepository.updateCategory(category.id, {
        name,
        color
      });
      
      onUpdated(updatedCategory);
      onClose();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1D1825] text-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Editar Categoría</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#0D0714] border border-gray-600"
        />

        <div className="mb-4">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
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
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={loading} className="bg-[#9E78CF] text-[#0D0714] px-4 py-2 rounded font-semibold">
            {loading ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};
