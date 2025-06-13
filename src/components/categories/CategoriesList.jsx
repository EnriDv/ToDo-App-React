import React, { useState, useEffect } from "react";
import { taskRepository } from "../../services/TaskRepository";
import { categoryRepository } from "../../services/CategoryRepository";
import CategorieCard from "./CategorieCard";
import { CreateCategoryModal } from "./CreateCategorieModal";
import {CreateTaskModal} from "../tasks/CreateTaskModal";
import { EditCategoryModal } from "./EditCategoryModal";
import CategoryTaskList from "../tasks/CategoryTaskList";
import { Plus } from 'lucide-react';

export default function CategoriesList({ sheetId, onTaskDetail }) {
    const [state, setState] = useState({
        tasksByCategory: {},
        categories: []
    });

    // Helper function to filter out deleted tasks
    const filterDeletedTasks = (tasks) => {
        return tasks.filter(task => !task.is_deleted);
    };
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

    // Subscribe to task updates
    const taskUnsubscribe = taskRepository.addTaskListener((event) => {
        // Handle different types of events
        switch (event.type) {
            case 'create':
                if (!event.task || !event.task.category_id) return;
                setState(prev => ({
                    ...prev,
                    tasksByCategory: {
                        ...prev.tasksByCategory,
                        [event.task.category_id]: filterDeletedTasks([
                            ...(prev.tasksByCategory[event.task.category_id] || []),
                            { ...event.task, is_deleted: false }
                        ])
                    }
                }));
                break;
            case 'update':
                if (!event.task || !event.task.category_id) return;
                setState(prev => ({
                    ...prev,
                    tasksByCategory: {
                        ...prev.tasksByCategory,
                        [event.task.category_id]: filterDeletedTasks(prev.tasksByCategory[event.task.category_id]?.map(task => 
                            task.id === event.task.id ? { ...event.task, is_deleted: false } : task
                        ) || [])
                    }
                }));
                break;
            case 'delete':
                if (!event.task || !event.task.category_id) return;
                setState(prev => ({
                    ...prev,
                    tasksByCategory: {
                        ...prev.tasksByCategory,
                        [event.task.category_id]: filterDeletedTasks(prev.tasksByCategory[event.task.category_id]?.map(task => 
                            task.id === event.task.id ? { ...event.task, is_deleted: true } : task
                        ) || [])
                    }
                }));
                break;
        }
    });

    // Subscribe to category updates
    const categoryUnsubscribe = categoryRepository.addCategoryListener((event) => {
        switch (event.type) {
            case 'create':
                setState(prev => ({
                    ...prev,
                    categories: [...prev.categories, event.category]
                }));
                break;
            case 'update':
                setState(prev => ({
                    ...prev,
                    categories: prev.categories.map(category => 
                        category.id === event.category.id ? event.category : category
                    )
                }));
                break;
            case 'delete':
                setState(prev => ({
                    ...prev,
                    categories: prev.categories.filter(category => category.id !== event.id)
                }));
                break;
        }
    });

    useEffect(() => {
        // Cleanup subscriptions
        return () => {
            taskUnsubscribe?.();
            categoryUnsubscribe?.();
        };
    }, [sheetId, taskUnsubscribe, categoryUnsubscribe]);

    // Initial fetch
    (async () => {
        const allTasks = await taskRepository.getTasks();
        const groupedTasks = allTasks.reduce((acc, task) => {
            if (!task.is_deleted) {
                acc[task.category_id] = acc[task.category_id] || [];
                acc[task.category_id].push(task);
            }
            return acc;
        }, {});
        
        // Get categories
        const categories = await categoryRepository.getCategories(sheetId);
        
        setState({ 
            tasksByCategory: groupedTasks,
            categories
        });
    })();

    const { categories } = state; // Use categories from state
    
    if (!categories) return null; // Loading state

    // Pass task detail handler directly from props
    const handleTaskDetail = (task) => {
        // Siempre pasa las categorías actuales
        onTaskDetail(task, state.categories);
    };

    // Return JSX

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#9E78CF]">Categorías</h2>
      </div>

      {/* Botones superiores */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Plus className="w-5 h-5 inline-block mr-2" />
          Crear categoría
        </button>
        <button
          onClick={() => setShowCreateTaskModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Plus className="w-5 h-5 inline-block mr-2" />
          Crear tarea
        </button>
      </div>

      {/* Modales */}
      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
            taskRepository.getTasks().then(tasks => {
                const groupedTasks = tasks.reduce((acc, task) => {
                    if (!task.is_deleted) {
                        acc[task.category_id] = acc[task.category_id] || [];
                        acc[task.category_id].push(task);
                    }
                    return acc;
                }, {});
                setState({ tasksByCategory: groupedTasks });
            });
        }}
      />
      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        categories={categories}
        onCreated={() => {
            taskRepository.getTasks().then(tasks => {
                const groupedTasks = tasks.reduce((acc, task) => {
                    if (!task.is_deleted) {
                        acc[task.category_id] = acc[task.category_id] || [];
                        acc[task.category_id].push(task);
                    }
                    return acc;
                }, {});
                setState({ tasksByCategory: groupedTasks });
            });
        }}
      />
      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        category={selectedCategory}
        onUpdated={() => {
            taskRepository.getTasks().then(tasks => {
                const groupedTasks = tasks.reduce((acc, task) => {
                    if (!task.is_deleted) {
                        acc[task.category_id] = acc[task.category_id] || [];
                        acc[task.category_id].push(task);
                    }
                    return acc;
                }, {});
                setState({ tasksByCategory: groupedTasks });
            });
        }}
      />

      {/* Lista de categorías */}
      {categories && categories.length === 0 ? (
        <p className="text-center text-white/70">No hay categorías disponibles</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <CategorieCard
                key={category.id}
                category={category}
                tasks={state.tasksByCategory[category.id] || []}
                onEdit={() => {
                  setSelectedCategory(category);
                  setShowEditModal(true);
                }}
                onDelete={() => {
                  categoryRepository.deleteCategory(category.id);
                }}
                onTaskDetail={handleTaskDetail}
              />
              <CategoryTaskList 
                tasks={state.tasksByCategory[category.id] || []}
                categories={state.categories}
                onTaskUpdated={() => {
                    taskRepository.getTasks().then(tasks => {
                        const groupedTasks = tasks.reduce((acc, task) => {
                            if (!task.is_deleted) {
                                acc[task.category_id] = acc[task.category_id] || [];
                                acc[task.category_id].push(task);
                            }
                            return acc;
                        }, {});
                        setState({ tasksByCategory: groupedTasks });
                    });
                }}
                onTaskDeleted={() => {
                    taskRepository.getTasks().then(tasks => {
                        const groupedTasks = tasks.reduce((acc, task) => {
                            if (!task.is_deleted) {
                                acc[task.category_id] = acc[task.category_id] || [];
                                acc[task.category_id].push(task);
                            }
                            return acc;
                        }, {});
                        setState({ tasksByCategory: groupedTasks });
                    });
                }}
                onTaskDetail={onTaskDetail}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
