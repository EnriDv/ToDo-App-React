import React from "react";
import TaskCard from "./TaskCard";

export default function TaskList({ tasks, categories, onTaskUpdated, onTaskDeleted }) {
  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">Tareas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            category={categories.find((c) => c.id === task.category_id)}
            onUpdated={onTaskUpdated}
            onDeleted={onTaskDeleted}
          />
        ))}
      </div>
    </div>
  );
}
