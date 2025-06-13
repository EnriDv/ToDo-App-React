import React from "react";
import { getSupaBaseClient } from "../../supabase-client";

export default function TaskCard({ task, category, onUpdated }) {
  const supabase = getSupaBaseClient("todo");

  const toggleCompleted = async () => {
    const { data } = await supabase
      .from("tasks")
      .update({ is_completed: !task.is_completed })
      .eq("id", task.id)
      .select()
      .single();

    if (data) onUpdated(data);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow text-black">
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
