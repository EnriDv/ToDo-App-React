import React from 'react';
import TaskCard from './TaskCard';

export default function CategoryTaskList({ tasks, category, onTaskUpdated, onTaskDeleted }) {
  return (
    <div className="mt-4 space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          category={category}
          onUpdated={onTaskUpdated}
          onDeleted={onTaskDeleted}
        />
      ))}
    </div>
  );
}
