import api from './api';

const transactionService = {
    // Get all transactions with optional filters
    getAll: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters);
            const response = await api.get(`/api/transactions?${params}`);
            return response.data;
        } catch (error) {
            console.error('Get transactions error:', error);
            throw error;
        }
    },

    // Get transaction statistics
    getStatistics: async (period = 'month') => {
        try {
            const response = await api.get(`/api/transactions/stats?period=${period}`);
            return response.data;
        } catch (error) {
            console.error('Get statistics error:', error);
            throw error;
        }
    },

    // Get category breakdown
    getCategoryBreakdown: async (period = 'month') => {
        try {
            const response = await api.get(`/api/transactions/categories?period=${period}`);
            return response.data;
        } catch (error) {
            console.error('Get category breakdown error:', error);
            throw error;
        }
    },

    // Create new transaction
    create: async (transactionData) => {
        try {
            const response = await api.post('/api/transactions', transactionData);
            return response.data;
        } catch (error) {
            console.error('Create transaction error:', error);
            throw error;
        }
    },

    // Update transaction
    update: async (id, updates) => {
        try {
            const response = await api.put(`/api/transactions/${id}`, updates);
            return response.data;
        } catch (error) {
            console.error('Update transaction error:', error);
            throw error;
        }
    },

    // Delete transaction
    delete: async (id) => {
        try {
            const response = await api.delete(`/api/transactions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete transaction error:', error);
            throw error;
        }
    }
};

export default transactionService;
