import api from './api';

const analyticsService = {
    // Get complete financial overview
    getOverview: async (period = 'month') => {
        try {
            const response = await api.get(`/api/analytics/overview?period=${period}`);
            return response.data;
        } catch (error) {
            console.error('Get overview error:', error);
            throw error;
        }
    },

    // Get spending trends
    getSpendingTrends: async (months = 6) => {
        try {
            const response = await api.get(`/api/analytics/spending-trends?months=${months}`);
            return response.data;
        } catch (error) {
            console.error('Get spending trends error:', error);
            throw error;
        }
    },

    // Get category insights
    getCategoryInsights: async (period = 'month') => {
        try {
            const response = await api.get(`/api/analytics/category-insights?period=${period}`);
            return response.data;
        } catch (error) {
            console.error('Get category insights error:', error);
            throw error;
        }
    },

    // Get predictions
    getPredictions: async () => {
        try {
            const response = await api.get('/api/analytics/predictions');
            return response.data;
        } catch (error) {
            console.error('Get predictions error:', error);
            throw error;
        }
    }
};

export default analyticsService;
