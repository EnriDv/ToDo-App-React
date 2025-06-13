import { Subject } from "../utils/Subject";
import { getSupaBaseClient } from "../supabase-client";

class CategoryRepository {
    constructor() {
        this.supabase = getSupaBaseClient("todo");
        this.categorySubject = new Subject();
    }

    // Observer Pattern - Notify subscribers when categories change
    addCategoryListener(callback) {
        return this.categorySubject.subscribe(callback);
    }

    // Factory Pattern for creating category objects from data
    static createCategoryData(data) {
        return {
            id: data.id,
            name: data.name,
            color: data.color,
            sheet_id: data.sheet_id,
            is_deleted: data.is_deleted || false,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    }

    async getCategories(sheetId) {
        const { data, error } = await this.supabase
            .from('categories')
            .select('*')
            .eq('sheet_id', sheetId)
            .eq('is_deleted', false)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data.map(category => CategoryRepository.createCategoryData(category));
    }

    async getCategory(id) {
        const { data, error } = await this.supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return CategoryRepository.createCategoryData(data);
    }

    async createCategory(data) {
        const { data: Catdata, error } = await this.supabase
            .from('categories')
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        const category = CategoryRepository.createCategoryData(Catdata);
        this.categorySubject.notify({ type: 'create', category });
        return category;
    }

    async updateCategory(id, updates) {
        const { data, error } = await this.supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        const category = CategoryRepository.createCategoryData(data);
        this.categorySubject.notify({ type: 'update', category });
        return category;
    }

    async deleteCategory(id) {
        const { data, error } = await this.supabase
            .from('categories')
            .update({ is_deleted: true })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        this.categorySubject.notify({ type: 'delete', id });
        return data;
    }
}

export const categoryRepository = new CategoryRepository();
