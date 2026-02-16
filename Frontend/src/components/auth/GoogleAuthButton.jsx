// frontend/src/views/GoogleAuthButton.jsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const GoogleAuthButton = ({ onSuccessCallback }) => {
    const { login } = useAuth();

    const handleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential;

        try {
            const res = await axios.post(`${API_URL}/auth/google`, { idToken });

            // Store token and user
            if (res.data.token && res.data.user) {
                login(res.data.token, res.data.user);
            }

            if (onSuccessCallback) {
                onSuccessCallback(res.data);
            }

        } catch (error) {
            console.error("Authentication failed. Please try again.");
            alert('Authentication failed on the server. Please try again.');
        }
    };

    const handleError = () => {
        console.error("Google login failed");
        alert('Google login failed. Please try again.');
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            text="signin_with"
        />
    );
};

export default GoogleAuthButton;