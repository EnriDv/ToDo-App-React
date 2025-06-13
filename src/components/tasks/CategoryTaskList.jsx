import React from 'react';
import TaskCard from './TaskCard';

export default function CategoryTaskList({ tasks, categories, onTaskUpdated, onTaskDeleted, onTaskDetail }) {
  return (
    <div className="mt-4 space-y-4">
      {tasks.filter(task => !task.is_deleted).map((task) => {
        const category = Array.isArray(categories) ? categories.find(c => c.id === task.category_id) : undefined;
        return (
          <TaskCard
            key={task.id}
            task={task}
            category={category}
            onUpdated={onTaskUpdated}
            onDeleted={onTaskDeleted}
            onDetailClick={onTaskDetail}
          />
        );
      })}
    </div>
  );
}
