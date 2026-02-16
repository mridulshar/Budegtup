import api from './api';

const budgetService = {
    // Get all budgets
    getAll: async (month, year) => {
        try {
            const params = new URLSearchParams();
            if (month) params.append('month', month);
            if (year) params.append('year', year);
            const response = await api.get(`/api/budgets?${params}`);
            return response.data;
        } catch (error) {
            console.error('Get budgets error:', error);
            throw error;
        }
    },

    // Get current month budgets
    getCurrent: async () => {
        try {
            const response = await api.get('/api/budgets/current');
            return response.data;
        } catch (error) {
            console.error('Get current budgets error:', error);
            throw error;
        }
    },

    // Create new budget
    create: async (budgetData) => {
        try {
            const response = await api.post('/api/budgets', budgetData);
            return response.data;
        } catch (error) {
            console.error('Create budget error:', error);
            throw error;
        }
    },

    // Update budget
    update: async (id, updates) => {
        try {
            const response = await api.put(`/api/budgets/${id}`, updates);
            return response.data;
        } catch (error) {
            console.error('Update budget error:', error);
            throw error;
        }
    },

    // Delete budget
    delete: async (id) => {
        try {
            const response = await api.delete(`/api/budgets/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete budget error:', error);
            throw error;
        }
    }
};

export default budgetService;
