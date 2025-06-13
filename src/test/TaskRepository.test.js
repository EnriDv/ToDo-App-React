import { describe, it, expect, vi, beforeEach } from 'vitest';
// Mockea supabase-client para que siempre devuelva un cliente con métodos mockeados
vi.mock('../supabase-client', () => {
  return {
    getSupaBaseClient: () => {
      return {
        from: () => {
          return {
            insert: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({ data: {
                  id: 1,
                  name: 'Test',
                  description: 'desc',
                  category_id: 2,
                  created_at: '2024-01-01',
                  is_completed: false
                }, error: null }))
              }))
            })),
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: [
                { id: 1, name: 'T1', description: '...', category_id: 2, sheet_id: 3, created_at: '', is_completed: false, is_deleted: false }
              ], error: null }))
            }))
          };
        }
      };
    }
  };
});

import { taskRepository as TaskRepository } from '../services/TaskRepository';

describe('TaskRepository', () => {
  // Mock Subject para listeners
  class MockSubject {
    constructor() { this.listeners = []; }
    subscribe(fn) { this.listeners.push(fn); return () => {}; }
    next(val) { this.listeners.forEach(fn => fn(val)); }
  }

  it('createTask retorna objeto de tarea normalizado', async () => {
    const result = await TaskRepository.createTask({
      id: 1,
      name: 'Test',
      description: 'desc',
      category_id: 2,
      sheet_id: 3,
      created_at: '2024-01-01',
      is_completed: false,
      is_deleted: false
    });
    expect(result).toMatchObject({
      id: 1,
      name: 'Test',
      description: 'desc',
      category_id: 2,
      created_at: '2024-01-01',
      is_completed: false
    });
  });

  it('getTasks retorna un array de tareas', async () => {
    const repo = TaskRepository;
    const supabaseFrom = repo.supabase.from();
    const mockSelect = supabaseFrom.select;
    mockSelect.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'T1', description: '...', category_id: 2, created_at: '', is_completed: false }
      ],
      error: null
    });
    const tasks = await repo.getTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0]).toHaveProperty('name', 'T1');
  });

  it('notifica a los listeners cuando cambia una tarea', () => {
    const repo = TaskRepository;
    repo.taskSubject = new MockSubject();
    const listener = vi.fn();
    repo.taskSubject.subscribe(listener);
    repo.taskSubject.next({ id: 123 });
    expect(listener).toHaveBeenCalledWith({ id: 123 });
  });
});


describe('TaskRepository', () => {
  beforeEach(() => {
    
  });

  it('createTask retorna objeto de tarea normalizado', async () => {
    const result = await TaskRepository.createTask({
      id: 1,
      name: 'Test',
      description: 'desc',
      category_id: 2,
      sheet_id: 3,
      created_at: '2024-01-01',
      is_completed: false,
      is_deleted: false
    });
    expect(result).toMatchObject({
      id: 1,
      name: 'Test',
      description: 'desc',
      category_id: 2,
      created_at: '2024-01-01',
      is_completed: false
    });
  });

  it('getTasks retorna un array de tareas', async () => {
    const repo = TaskRepository;
    const supabaseFrom = repo.supabase.from();
    const mockSelect = supabaseFrom.select;
    mockSelect.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'T1', description: '...', category_id: 2, sheet_id: 3, created_at: '', is_completed: false, is_deleted: false }
      ],
      error: null
    });
    const tasks = await repo.getTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0]).toHaveProperty('name', 'T1');
  });

  it('notifica a los listeners cuando cambia una tarea', () => {
    const repo = TaskRepository;
    const listener = vi.fn();
    repo.taskSubject.subscribe(listener);
    repo.taskSubject.next({ id: 123 });
    expect(listener).toHaveBeenCalledWith({ id: 123 });
  });
});
