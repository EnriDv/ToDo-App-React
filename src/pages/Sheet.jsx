// src/pages/Sheet.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSupaBaseClient } from "../supabase-client";
import CategoriesList from "../components/categories/CategoriesList";

export default function Sheet() {
  const { id: sheet_id } = useParams();
  const [categories, setCategories] = useState([]);
  const [tasksByCat, setTasksByCat] = useState({});
  const [loading, setLoading] = useState(true);
  const supabase = getSupaBaseClient("todo");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, color, created_at")
        .eq("sheet_id", sheet_id)
        .eq("is_deleted", false)
        .order("created_at");
      setCategories(cats || []);

      const catIds = (cats || []).map((c) => c.id);
      if (catIds.length > 0) {
        const { data: tasks } = await supabase
          .from("tasks")
          .select("id, category_id, name, is_completed, is_deleted")
          .in("category_id", catIds)
          .order("created_at");
        const grouped = {};
        tasks.forEach((t) => {
          if (!t.is_deleted) {
            grouped[t.category_id] = grouped[t.category_id] || [];
            grouped[t.category_id].push(t);
          }
        });
        setTasksByCat(grouped);
      }
      setLoading(false);
    };

    fetchData();
  }, [sheet_id]);

  return (
    <div className="min-h-screen bg-[#0D0714] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-4 text-[#9E78CF]">
        Categorías & Tareas
      </h1>
      {loading ? (
        <p className="text-center">Cargando…</p>
      ) : (
        <CategoriesList
          categories={categories}
          tasksByCat={tasksByCat}
        />
      )}
    </div>
  );
}
