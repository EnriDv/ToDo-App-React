import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSupaBaseClient } from "../supabase-client";

export default function Sheet() {
  const { id } = useParams();              // recupera el sheet_id de la URL
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const supabase = getSupaBaseClient("todo");
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, color, created_at")
        .eq("sheet_id", id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar categorías:", error);
        setCategories([]);
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    };

    fetchCategories();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0D0714] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#9E78CF]">
        Categorías
      </h1>

      {loading ? (
        <p className="text-center text-white/70">Cargando categorías…</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-white/70">No hay categorías aún.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const bg = cat.color || "#2E2B3A"; // gris por defecto
            return (
              <div
                key={cat.id}
                className="rounded-2xl p-4 flex items-center justify-center shadow-md hover:opacity-90 transition"
                style={{ backgroundColor: bg, aspectRatio: "1 / 1" }}
              >
                <span className="text-center font-semibold text-[#0D0714]">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
