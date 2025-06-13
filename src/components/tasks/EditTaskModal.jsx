import React, { useState, useEffect } from 'react';
import { taskRepository } from "../../services/TaskRepository";

export default function EditTaskModal({ isOpen, onClose, task, categories, onUpdated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setTimeLimit(task.time_limit ? task.time_limit.replace(/\s/g, 'T') : '');
      setSelectedCategory(task.category_id);
    }
  }, [task]);

  useEffect(() => {
    const unsubscribe = taskRepository.addTaskListener((event) => {
      if (event.type === 'update' && event.task.id === task.id) {
        onUpdated(event.task);
      }
    });

    return () => unsubscribe();
  }, [task.id, onUpdated]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updatedTask = await taskRepository.updateTask(task.id, {
        name,
        description,
        time_limit: timeLimit,
        category_id: selectedCategory,
      });
      
      onUpdated(updatedTask);
      onClose();
    } catch (err) {
      setError(err.message || "Error al actualizar la tarea. Por favor, inténtalo de nuevo.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl text-black w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Editar tarea</h3>
        
        <div className="space-y-4">
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
          <div>
            <label className="block mb-1">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              {Array.isArray(categories) && categories.length > 0 ? (
                categories
                  .filter(c => !c.is_deleted)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
              ) : (
                <option value="">No hay categorías disponibles</option>
              )}
            </select>
          </div>
          <input
            type="datetime-local"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
          />
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              Cerrar
            </button>
            <button 
              onClick={handleSubmit}
              className="bg-black text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
