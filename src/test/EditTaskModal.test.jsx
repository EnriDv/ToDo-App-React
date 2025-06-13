import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EditTaskModal from '../components/tasks/EditTaskModal.jsx';

// Mock del repositorio para que updateTask resuelva correctamente
vi.mock('../services/TaskRepository', () => ({
  taskRepository: {
    updateTask: vi.fn().mockResolvedValue({ id: 101, name: 'Nuevo nombre', description: 'Descripción', category_id: 1 }),
    addTaskListener: vi.fn(() => () => {}) // Mock de listener
  }
}));

const categories = [
  { id: 1, name: 'Trabajo' },
  { id: 2, name: 'Personal' }
];
const task = {
  id: 101,
  name: 'Tarea de prueba',
  description: 'Descripción',
  category_id: 1
};

describe('EditTaskModal', () => {
  it('renderiza los campos con los valores actuales', () => {
    render(
      <EditTaskModal
        isOpen={true}
        onClose={() => {}}
        task={task}
        categories={categories}
        onUpdated={() => {}}
      />
    );
    expect(screen.getByPlaceholderText('Nombre').value).toBe('Tarea de prueba');
    expect(screen.getByPlaceholderText('Descripción').value).toBe('Descripción');
    // Verifica que la categoría seleccionada sea la correcta
    expect(screen.getByDisplayValue('Trabajo')).toBeTruthy();
  });

  it('llama a onUpdated al hacer click en Guardar', async () => {
    const onUpdated = vi.fn();
    render(
      <EditTaskModal
        isOpen={true}
        onClose={() => {}}
        task={task}
        categories={categories}
        onUpdated={onUpdated}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Nuevo nombre' } });
    fireEvent.click(screen.getByText('Guardar'));
    // Espera a que la función onUpdated sea llamada (por ser async)
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(onUpdated).toHaveBeenCalled();
  });

  it('muestra error si el nombre está vacío', () => {
    render(
      <EditTaskModal
        isOpen={true}
        onClose={() => {}}
        task={{ ...task, name: '' }}
        categories={categories}
        onUpdated={() => {}}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Guardar'));
    expect(screen.getByText('El nombre no puede estar vacío.')).toBeTruthy();
  });
});
