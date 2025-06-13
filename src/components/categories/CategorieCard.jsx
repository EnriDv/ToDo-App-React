// src/components/categories/CategorieCard.jsx
import React, { useState } from "react";
import { getSupaBaseClient } from "../../supabase-client";
import { Pencil, Trash } from 'lucide-react';
import TaskCard from "../tasks/TaskCard";
import { EditCategoryModal } from "./EditCategoryModal";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";

export default function CategorieCard({ category, onUpdated }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const supabase = getSupaBaseClient("todo");
  const isDefault = category?.name === "To Do";

  const handleDelete = async () => {
    const { error } = await supabase
      .from("categories")
      .update({ is_deleted: true })
      .eq("id", category.id);
    if (!error) {
      setShowDelete(false);
      onUpdated?.();
    }
  };

  return (
    <>
      <div
        className="relative rounded-2xl p-4 shadow-md bg-white text-black flex flex-col"
        style={{ backgroundColor: category?.color || "#ECECEC", height: "auto" }}
      >
        {/* Título y botones */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">{category?.name}</h3>
          {!isDefault && (
            <div className="flex space-x-2">
              <button onClick={() => setShowEdit(true)}><Pencil size={20} /></button>
              <button onClick={() => setShowDelete(true)}><Trash size={20} /></button>
            </div>
          )}
        </div>

      </div>

      {/* Modales */}
      {!isDefault && (
        <EditCategoryModal
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          category={category}
          onUpdated={() => {
            setShowEdit(false);
            onUpdated?.();
          }}
        />
      )}
      {!isDefault && (
        <DeleteConfirmationModal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
          message={`¿Eliminar categoría "${category?.name}"?`}
        />
      )}
    </>
  );
}
