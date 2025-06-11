import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash } from 'lucide-react';
import { getSupaBaseClient } from '../../supabase-client';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { SketchPicker } from 'react-color';

export function SheetCard({ sheet, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempColor, setTempColor] = useState(sheet.color ?? '#2E2B3A');
  const supabaseTodoClient = getSupaBaseClient('todo');

  const handleClick = e => {
    if (isConfirmOpen || isEditing || e.target.closest('button')) return;
    navigate(`/sheet/${sheet.id}`);
  };

  const confirmDelete = async () => {
    const { error } = await supabaseTodoClient
      .from('sheets')
      .delete()
      .eq('id', sheet.id);
    if (!error) onDelete(sheet.id);
    else console.error(error);
  };


  return (
    <>
      <div
        className="relative rounded-2xl p-6 shadow-md hover:opacity-90 transition cursor-pointer"
        style={{ backgroundColor: tempColor, aspectRatio: '3 / 1' }}
        onClick={handleClick}
      >
        {/* Editar */}
        <button
          className="absolute top-2 left-2 text-white hover:opacity-80 transition cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(sheet);
          }}
        >
          <Pencil size={20} />
        </button>

        <button
          className="absolute top-2 right-2 text-white hover:opacity-80 transition cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            setIsConfirmOpen(true);
          }}
        >
          <Trash size={20} />
        </button>

          <div className="flex h-full items-center justify-center">
            <h2 className="text-xl font-semibold text-[#0D0714]">{sheet.name}</h2>
          </div>

      </div>

      {/* Modal de confirmación */}
      <DeleteConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message={`¿Eliminar la hoja "${sheet.name}"?`}
      />
    </>
  );
}
