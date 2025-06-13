import React, { useState, useEffect } from 'react';
import { taskRepository } from "../../services/TaskRepository";
import { categoryRepository } from "../../services/CategoryRepository";
import { EditTaskModal } from './EditTaskModal';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';

export function TaskDetail({ isOpen, onClose, task, categories, onUpdated, onDelete }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskCategory, setTaskCategory] = useState(null);
  const [sheetCategories, setSheetCategories] = useState([]);

  useEffect(() => {
    if (task?.category_id) {
      categoryRepository.getCategory(task.category_id).then(setTaskCategory);
    } else {
      setTaskCategory(null);
    }
  }, [task]);

  useEffect(() => {
    if (taskCategory?.sheet_id) {
      categoryRepository.getCategories(taskCategory.sheet_id).then(setSheetCategories);
    } else {
      setSheetCategories([]);
    }
  }, [taskCategory]);

  const handleEdit = (updatedTask) => {
    onUpdated(updatedTask);
    onClose();
  };

  const handleDelete = async () => {
    try {
      // Delete task using TaskRepository
      await taskRepository.deleteTask(task.id);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl text-black w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Detalles de la tarea</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 absolute top-4 right-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Nombre</label>
            <p className="text-gray-700">{task.name}</p>
          </div>
          <div>
            <label className="block mb-1">Descripción</label>
            <p className="text-gray-700">{task.description}</p>
          </div>
          <div>
            <label className="block mb-1">Categoría</label>
            <p className="text-gray-700">{taskCategory?.name || 'Sin categoría'}</p>
          </div>
          <div>
            <label className="block mb-1">Fecha límite</label>
            <p className="text-gray-700">{new Date(task.time_limit).toLocaleString('es-ES', { 
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hour12: true
              })}</p>
          </div>
          <div>
            <label className="block mb-1">Estado</label>
            <p className="text-gray-700">{task.is_completed ? 'Completada' : 'Pendiente'}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button 
            onClick={() => setShowEditModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Eliminar Tarea
          </button>
        </div>

        <EditTaskModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          task={task}
          categories={sheetCategories}
          onUpdated={handleEdit}
        />

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          message={`¿Eliminar la tarea "${task.name}"?`}
        />
      </div>
    </div>
  );
}