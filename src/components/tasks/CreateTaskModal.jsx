import React, { useState } from "react";
import { getSupaBaseClient } from "../../supabase-client";

export function CreateTaskModal({ isOpen, onClose, categories, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const defaultCategory = categories.find((c) => c.name === "To Do");

  const handleSubmit = async () => {
    const supabase = getSupaBaseClient("todo");

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        name,
        description,
        time_limit: new Date(timeLimit).toISOString(),
        category_id: defaultCategory.id,
      })
      .select()
      .single();

    if (!error && data) {
      onCreated(data);
      setName("");
      setDescription("");
      setTimeLimit("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl text-black w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Crear nueva tarea</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        />
        <input
          type="datetime-local"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-500">Cancelar</button>
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
