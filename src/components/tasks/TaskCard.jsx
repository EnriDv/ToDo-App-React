import React, { useEffect } from "react";
import { taskRepository } from "../../services/TaskRepository";

export default function TaskCard({ task, category, onUpdated, onDetailClick }) {
  const handleClick = (e) => {
    // Solo abrir detalles si se hace clic en el texto o la categoría
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SPAN') {
      onDetailClick(task);
    }
  };

  const toggleCompleted = async () => {
    try {
      const updatedTask = await taskRepository.updateTask(task.id, { is_completed: !task.is_completed });
      onUpdated(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Subscribe to task updates
  useEffect(() => {
    const unsubscribe = taskRepository.addTaskListener((event) => {
      if (event.type === 'update' && event.task.id === task.id) {
        onUpdated(event.task);
      }
    });

    return () => unsubscribe();
  }, [task.id, onUpdated]);

  return (
    <div 
      className="bg-white rounded-xl p-4 shadow text-black cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={toggleCompleted}
        />
        <span className={task.is_completed ? "line-through text-gray-500" : ""}>
          {task.name}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">Categoría: {category?.name || "?"}</p>
    </div>
  );
}
