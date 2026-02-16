import api from './api';

const profileService = {
    // Get user profile
    getProfile: async () => {
        try {
            const response = await api.get('/api/profile');
            return response.data;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },

    // Update profile (name, email)
    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/api/profile', profileData);
            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    // Change password
    changePassword: async (oldPassword, newPassword) => {
        try {
            const response = await api.put('/api/profile/password', {
                oldPassword,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },

    // Set initial password (for Google users)
    setPassword: async (password, token = null) => {
        try {
            const response = await api.post('/api/profile/set-password', {
                password,
                token
            });
            return response.data;
        } catch (error) {
            console.error('Set password error:', error);
            throw error;
        }
    },

    // Send password set email
    sendPasswordSetEmail: async () => {
        try {
            const response = await api.post('/api/profile/send-password-email');
            return response.data;
        } catch (error) {
            console.error('Send password email error:', error);
            throw error;
        }
    },

    // Send password reset email
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/api/profile/forgot-password', { email });
            return response.data;
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    },

    // Reset password with token
    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post('/api/profile/reset-password', {
                token,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    }
};

export default profileService;
