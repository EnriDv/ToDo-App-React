// src/pages/Sheet.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { taskRepository } from "../services/TaskRepository";
import CategoriesList from "../components/categories/CategoriesList";
import {TaskDetail} from "../components/tasks/TaskDetail";

export default function Sheet() {
  const { id: sheet_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  const [categories, setCategories] = useState([]);

  const handleTaskDetail = (task, taskCategories) => {
    setSelectedTask(task);
    // Si taskCategories está vacío, no lo actualices
    if (Array.isArray(taskCategories) && taskCategories.length > 0) {
      setCategories(taskCategories);
    }
  }

  const closeTaskDetail = () => {
    setSelectedTask(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // CategoriesList maneja sus propias suscripciones, no necesitamos hacer nada aquí
    return () => {
      // No hay nada que limpiar
    };
  }, [sheet_id]);

  useEffect(() => {
    // Subscribe to task updates
    const taskUnsubscribe = taskRepository.addTaskListener((event) => {
      switch (event.type) {
        case 'create':
          break;
        case 'update':
          break;
        case 'delete':
          break;
      }
    });

    // Initial fetch
    fetchData();

    return () => {
      taskUnsubscribe();
    };
  }, [sheet_id]);

  return (
    <div className="min-h-screen bg-[#0D0714] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-4 text-[#9E78CF]">
        Categorías & Tareas
      </h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9E78CF]"></div>
        </div>
      ) : (
        <CategoriesList 
          sheetId={sheet_id}
          onTaskDetail={handleTaskDetail}
        />
      )}
      <TaskDetail
        isOpen={selectedTask !== null}
        onClose={closeTaskDetail}
        task={selectedTask}
        categories={categories}
        onUpdated={fetchData}
        onDelete={fetchData}
      />
    </div>
  );
}
