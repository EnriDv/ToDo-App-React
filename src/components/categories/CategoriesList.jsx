import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSupaBaseClient } from "../../supabase-client.js";
import CategorieCard from "./CategorieCard";
import { CreateCategoryModal } from "./CreateCategorieModal";
import { CreateTaskModal } from "../tasks/CreateTaskModal";
import CategoryTaskList from "../tasks/CategoryTaskList";

export default function CategoriesList() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const supabase = getSupaBaseClient("todo");

    // Primero obtenemos las categorías de esta hoja
    const { data: catData } = await supabase
      .from("categories")
      .select("id, name, color")
      .eq("sheet_id", id)
      .eq("is_deleted", false);

    // Obtenemos los IDs de las categorías de esta hoja
    const categoryIds = (catData || []).map(cat => cat.id);

    // Luego obtenemos solo las tareas que pertenecen a estas categorías
    const { data: taskData } = await supabase
      .from("tasks")
      .select("id, name, is_completed, is_deleted, category_id")
      .eq("is_deleted", false)
      .in("category_id", categoryIds);

    setCategories(catData || []);
    setTasks(taskData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTaskCreated = (newTask) => {
    fetchData();
    setTasks((prev) => [...prev, newTask]);
    setShowTaskModal(false);
  };

  const handleTaskUpdated = (updatedTask) => {
    fetchData();
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleTaskDeleted = (deletedId) => {
    fetchData();
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
  };

  return (
    <div>
      {/* Botones superiores */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-white text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
        >
          ➕ Crear Categoría
        </button>
        <button
          onClick={() => setShowTaskModal(true)}
          className="bg-white text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
        >
          📝 Agregar Tarea
        </button>
      </div>

      {/* Categorías con sus tareas */}
      {loading ? (
        <p className="text-center text-white/70">Cargando categorías y tareas…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
          {categories.map((cat) => (
            <div key={cat.id} className="space-y-4">
              <CategorieCard 
                category={cat} 
                onUpdated={fetchData}  
              />
              <CategoryTaskList
                tasks={tasks.filter(t => t.category_id === cat.id)}
                category={cat}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modales */}
      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(newCat) => {setCategories((prev) => [...prev, newCat]); fetchData()}}
      />
      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        categories={categories}
        onCreated={handleTaskCreated}
      />
    </div>
  );
}
