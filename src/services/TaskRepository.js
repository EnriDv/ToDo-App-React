import { getSupaBaseClient } from "../supabase-client";
import { Subject } from "../utils/Subject";

class TaskRepository {
    constructor() {
        this.supabase = getSupaBaseClient("todo");
        this.taskSubject = new Subject();
        this.realtimeSubscriptions = new Set();
    }

    // Observer Pattern - Notify subscribers when tasks change
    addTaskListener(callback) {
        // Create a new subscription
        const subscription = this.taskSubject.subscribe(callback);
        
        // Store the subscription
        if (!this.subscriptions) {
            this.subscriptions = new Set();
        }
        this.subscriptions.add(subscription);
        
        // Return cleanup function
        return () => {
            subscription();
            this.subscriptions.delete(subscription);
        };
    }

    // Real-time subscription for tasks
    subscribeToTasks(callback) {
        if (!this.realtimeSubscriptions.size) {
            // Only create one real-time subscription
            const subscription = this.supabase
                .channel('tasks-channel')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'tasks',
                }, (payload) => {
                    // Handle different types of changes
                    let type;
                    switch (payload.eventType) {
                        case 'INSERT':
                            type = 'create';
                            break;
                        case 'UPDATE':
                            type = 'update';
                            break;
                        case 'DELETE':
                            type = 'delete';
                            break;
                    }
                    
                    // Get the task data
                    const task = payload.new || payload.old;
                    
                    // Notify subscribers
                    this.notifyTaskChange(type, task);
                })
                .subscribe();

            this.realtimeSubscriptions.add(subscription);
        }
        
        // Add our listener
        const listener = this.addTaskListener(callback);
        
        // Return cleanup function
        return () => {
            listener();
            // If no more listeners, unsubscribe from real-time
            if (this.subscriptions.size === 0) {
                this.realtimeSubscriptions.forEach(sub => sub.unsubscribe());
                this.realtimeSubscriptions.clear();
            }
        };
    }

    // Factory Pattern for creating tasks
    static createTask(data) {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            time_limit: data.time_limit,
            is_completed: data.is_completed || false,
            category_id: data.category_id,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    }

    // Helper to prevent duplicate events
    notifyTaskChange(type, task) {
        if (!this.subscriptions) return;
        
        // Create a new event object with unique IDs
        const event = { 
            type, 
            task: { 
                ...task,
                _event_id: Date.now() + Math.random() // Unique event ID
            } 
        };
        
        // Notify subscribers
        this.taskSubject.notify(event);
    }

    async getTasks() {
        const { data, error } = await this.supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map(task => TaskRepository.createTask(task));
    }

    async getTask(id) {
        const { data, error } = await this.supabase
            .from('tasks')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return TaskRepository.createTask(data);
    }

    async createTask(taskData) {
        const { data, error } = await this.supabase
            .from('tasks')
            .insert(taskData)
            .select()
            .single();

        if (error) throw error;
        const task = TaskRepository.createTask(data);
        this.notifyTaskChange('create', task);
        return task;
    }

    async updateTask(id, updates) {
        const { data, error } = await this.supabase
            .from('tasks')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        const task = TaskRepository.createTask(data);
        this.notifyTaskChange('update', task);
        return task;
    }

    async deleteTask(id) {
        const { data, error } = await this.supabase
            .from('tasks')
            .update({ is_deleted: true })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        this.taskSubject.notify({ type: 'delete', data });
        return data;
    }
}

export const taskRepository = new TaskRepository();
