import api from './api';

const aiAgentService = {
    // Analyze user finances
    analyze: async (focusArea = 'general') => {
        try {
            const response = await api.post('/api/agent/analyze', { focusArea });
            return response.data;
        } catch (error) {
            console.error('Analyze finances error:', error);
            throw error;
        }
    },

    // Chat with AI agent
    chat: async (message, context = {}) => {
        try {
            const response = await api.post('/api/agent/chat', { message, context });
            return response.data;
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    },

    // Get AI insights
    getInsights: async () => {
        try {
            const response = await api.get('/api/agent/insights');
            return response.data;
        } catch (error) {
            console.error('Get insights error:', error);
            throw error;
        }
    },

    // Get recommendations
    getRecommendations: async () => {
        try {
            const response = await api.get('/api/agent/recommendations');
            return response.data;
        } catch (error) {
            console.error('Get recommendations error:', error);
            throw error;
        }
    }
};

export default aiAgentService;
