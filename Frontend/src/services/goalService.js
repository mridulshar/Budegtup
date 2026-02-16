import api from './api';

const goalService = {
    // Get all goals
    getAll: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters);
            const response = await api.get(`/api/goals?${params}`);
            return response.data;
        } catch (error) {
            console.error('Get goals error:', error);
            throw error;
        }
    },

    // Get goal progress
    getProgress: async (id) => {
        try {
            const response = await api.get(`/api/goals/${id}/progress`);
            return response.data;
        } catch (error) {
            console.error('Get goal progress error:', error);
            throw error;
        }
    },

    // Create new goal
    create: async (goalData) => {
        try {
            const response = await api.post('/api/goals', goalData);
            return response.data;
        } catch (error) {
            console.error('Create goal error:', error);
            throw error;
        }
    },

    // Update goal
    update: async (id, updates) => {
        try {
            const response = await api.put(`/api/goals/${id}`, updates);
            return response.data;
        } catch (error) {
            console.error('Update goal error:', error);
            throw error;
        }
    },

    // Add contribution to goal
    addContribution: async (id, amount) => {
        try {
            const response = await api.post(`/api/goals/${id}/contribute`, { amount });
            return response.data;
        } catch (error) {
            console.error('Add contribution error:', error);
            throw error;
        }
    },

    // Delete goal
    delete: async (id) => {
        try {
            const response = await api.delete(`/api/goals/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete goal error:', error);
            throw error;
        }
    }
};

export default goalService;
