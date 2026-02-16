import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";

const CurrencyContext = createContext();

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

export const CurrencyProvider = ({ children }) => {
    const { token, isLoggedIn } = useAuth();
    const [currency, setCurrency] = useState('USD');
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Currency symbol mapping
    const getCurrencySymbol = (currencyCode) => {
        const symbols = {
            'INR': '₹',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'CNY': '¥',
            'AUD': 'A$',
            'CAD': 'C$',
            'CHF': 'CHF',
            'RUB': '₽',
            'BRL': 'R$',
            'ZAR': 'R',
            'KRW': '₩',
            'MXN': '$',
            'SGD': 'S$',
            'HKD': 'HK$',
            'NZD': 'NZ$',
            'SEK': 'kr',
            'NOK': 'kr',
            'DKK': 'kr',
            'PLN': 'zł',
            'TRY': '₺',
            'THB': '฿',
            'IDR': 'Rp',
            'MYR': 'RM',
            'PHP': '₱',
            'AED': 'د.إ',
            'SAR': 'ر.س',
            'EGP': 'E£'
        };
        return symbols[currencyCode] || currencyCode || '$';
    };

    // Format amount with currency
    const formatAmount = (amount, showSymbol = true) => {
        if (amount === null || amount === undefined) return showSymbol ? `${currencySymbol}0` : '0';

        const formatted = Math.abs(amount).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });

        return showSymbol ? `${currencySymbol}${formatted}` : formatted;
    };

    // Fetch user profile and currency on mount
    useEffect(() => {
        const fetchProfile = async () => {
            if (!isLoggedIn || !token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Backend returns { data: { ... } }
                    const profileData = data.data || data.profile || data;
                    setProfile(profileData);
                    setCurrency(profileData.currency || 'USD');
                    setCurrencySymbol(getCurrencySymbol(profileData.currency || 'USD'));
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isLoggedIn, token]);

    const value = {
        currency,
        currencySymbol,
        profile,
        loading,
        formatAmount,
        getCurrencySymbol,
        refreshProfile: async () => {
            // Refetch profile
            if (!isLoggedIn || !token) return;

            try {
                const response = await fetch('http://localhost:5000/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const profileData = data.data || data.profile || data;
                    setProfile(profileData);
                    setCurrency(profileData.currency || 'USD');
                    setCurrencySymbol(getCurrencySymbol(profileData.currency || 'USD'));
                }
            } catch (error) {
                console.error('Error refreshing profile:', error);
            }
        }
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
