import React, { useState, useEffect } from "react";
import { taskRepository } from "../../services/TaskRepository";

export function CreateTaskModal({ isOpen, onClose, categories, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (!categories) return;

    // Buscar la primera categoría no eliminada de la hoja
    const validCategories = categories.filter(c => !c?.is_deleted);
    setSelectedCategory(validCategories[0]?.id);

    // Subscribe to task creation events
    const unsubscribe = taskRepository.addTaskListener((event) => {
      if (event.type === 'create') {
        onCreated(event.task);
      }
    });

    return () => unsubscribe();
  }, [categories, onCreated]);

  const handleSubmit = async () => {
    try {
      const newTask = await taskRepository.createTask({
        name,
        description,
        time_limit: timeLimit,
        category_id: selectedCategory,
      });

      setName("");
      setDescription("");
      setTimeLimit("");
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
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
        <div className="mb-4">
          <label className="block mb-1">Categoría</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            {categories
              .filter(c => !c.is_deleted)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
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
