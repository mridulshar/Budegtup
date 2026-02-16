// frontend/src/views/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load auth data from localStorage on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('currentUser');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setCurrentUser(JSON.parse(storedUser));
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                // Clear corrupted data
                localStorage.removeItem('token');
                localStorage.removeItem('currentUser');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken, user) => {
        // Save to state
        setToken(newToken);
        setIsLoggedIn(true);
        setCurrentUser(user);

        // Save to localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    const logout = () => {
        // Clear state
        setToken(null);
        setIsLoggedIn(false);
        setCurrentUser(null);

        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
    };

    const updateUser = (updatedUserData) => {
        // Update state
        setCurrentUser(prev => ({ ...prev, ...updatedUserData }));

        // Update localStorage
        const updatedUser = { ...currentUser, ...updatedUserData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    };

    const value = {
        isLoggedIn,
        currentUser,
        token,
        login,
        logout,
        updateUser,
        isLoading // Useful for showing loading state while checking auth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};