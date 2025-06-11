import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { getSupaBaseClient, supabase } from "../../supabase-client";
import { UserAuth } from "../../context/AuthContext";

export const CreateSheetModal = ({ isOpen, onClose, onSheetAdded }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#2E2B3A");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { session } = UserAuth();

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) {
    alert("El nombre no puede estar vacío.");
    return;
  }

    setLoading(true);
    
    const userId = session?.user?.id;

    const newSheet = {
      name,
      color,
      user_id: userId,
    };
    const supabaseTodoClient = getSupaBaseClient('todo');
    const { data, error } = await supabaseTodoClient
      .from("sheets") // si está en esquema "todo"
      .insert([newSheet])
      .select()      // agrega .select() para que retorne la fila
      .single();
      
    setLoading(false);
    if (error) {
        console.error("Error al crear hoja:", error);
        return;  // salir si hubo error para no continuar con código que espera data válido
    }

    if (!data) {
        console.error("No se recibió un 'data' válido tras crear la hoja.", data);
        return;
    }

    if (error) {
      console.error("Error al crear hoja:", error);
    } else {
      onSheetAdded(data); 
      onClose();
      setName("");
      setColor("#2E2B3A");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1D1825] text-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Crear nueva Hoja</h2>

        <input
          type="text"
          placeholder="Nombre de la hoja"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#0D0714] border border-gray-600 text-white placeholder-gray-400"
        />

        <div className="mb-4">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
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
            onClick={onClose}
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
};
