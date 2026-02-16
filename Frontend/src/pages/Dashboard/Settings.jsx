import React, { useState, useEffect } from 'react';
import { User, DollarSign, Save, X, Edit2, Mail, Flag, Briefcase } from 'lucide-react';
import { useCurrency } from "../../context/CurrencyContext";
import { useAuth } from "../../context/AuthContext";
import './Settings.css';

export default function Settings() {
    const { profile, currencySymbol, formatAmount, refreshProfile } = useCurrency();
    const { token } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        monthlyIncome: 0,
        pocketMoney: 0,
        incomeFrequency: 'monthly'
    });

    const incomeFrequencies = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Every 2 Weeks' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
    ];

    useEffect(() => {
        if (profile) {
            setFormData({
                monthlyIncome: profile.monthlyIncome || 0,
                pocketMoney: profile.pocketMoney || 0,
                incomeFrequency: profile.incomeFrequency || 'monthly'
            });
        }
    }, [profile]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            const response = await fetch('http://localhost:5000/api/user/financial-settings', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Financial settings updated successfully!' });
                setIsEditing(false);
                // Refresh profile in context
                await refreshProfile();
            } else {
                throw new Error('Failed to update settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset form to current profile values
        setFormData({
            monthlyIncome: profile?.monthlyIncome || 0,
            pocketMoney: profile?.pocketMoney || 0,
            incomeFrequency: profile?.incomeFrequency || 'monthly'
        });
        setIsEditing(false);
        setMessage(null);
    };

    const isStudent = profile?.occupation === 'Student';

    return (
        <div className="settings-container">
            <div className="settings-header">
                <div className="header-text">
                    <h1>Profile Settings</h1>
                    <p>Manage your account and financial preferences</p>
                </div>
            </div>

            {/* Profile Information */}
            <div className="settings-section">
                <h2 className="section-title">Profile Information</h2>

                <div className="info-card">
                    <div className="info-row">
                        <div className="info-label">
                            <User size={20} />
                            <span>Full Name</span>
                        </div>
                        <div className="info-value">{profile?.fullName || 'N/A'}</div>
                    </div>

                    <div className="info-row">
                        <div className="info-label">
                            <Mail size={20} />
                            <span>Email</span>
                        </div>
                        <div className="info-value">{profile?.email || 'N/A'}</div>
                    </div>

                    <div className="info-row">
                        <div className="info-label">
                            <Flag size={20} />
                            <span>Country</span>
                        </div>
                        <div className="info-value">
                            <span className="country-flag">{profile?.flag}</span>
                            {profile?.country || 'N/A'}
                            <span className="currency-badge">{profile?.currency}</span>
                        </div>
                    </div>

                    <div className="info-row">
                        <div className="info-label">
                            <Briefcase size={20} />
                            <span>Occupation</span>
                        </div>
                        <div className="info-value">{profile?.occupation || 'N/A'}</div>
                    </div>
                </div>
            </div>

            {/* Financial Settings */}
            <div className="settings-section">
                <div className="section-header-with-action">
                    <h2 className="section-title">Financial Settings</h2>
                    {!isEditing && (
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>
                            <Edit2 size={18} />
                            Edit
                        </button>
                    )}
                </div>

                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="info-card">
                    <div className="info-row">
                        <div className="info-label">
                            <DollarSign size={20} />
                            <span>{isStudent ? 'Monthly Pocket Money' : 'Monthly Income'}</span>
                        </div>
                        {isEditing ? (
                            <div className="input-wrapper">
                                <span className="input-currency">{currencySymbol}</span>
                                <input
                                    type="number"
                                    className="settings-input"
                                    value={isStudent ? formData.pocketMoney : formData.monthlyIncome}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        [isStudent ? 'pocketMoney' : 'monthlyIncome']: parseFloat(e.target.value) || 0
                                    })}
                                    placeholder="Enter amount"
                                />
                            </div>
                        ) : (
                            <div className="info-value highlight">
                                {formatAmount(isStudent ? profile?.pocketMoney : profile?.monthlyIncome)}
                            </div>
                        )}
                    </div>

                    {!isStudent && (
                        <div className="info-row">
                            <div className="info-label">
                                <span>Income Frequency</span>
                            </div>
                            {isEditing ? (
                                <div className="frequency-selector">
                                    {incomeFrequencies.map((freq) => (
                                        <button
                                            key={freq.value}
                                            className={`freq-btn ${formData.incomeFrequency === freq.value ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, incomeFrequency: freq.value })}
                                        >
                                            {freq.label}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="info-value">
                                    {incomeFrequencies.find(f => f.value === profile?.incomeFrequency)?.label || 'Monthly'}
                                </div>
                            )}
                        </div>
                    )}

                    {isEditing && (
                        <div className="action-buttons">
                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                <Save size={18} />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={handleCancel}
                                disabled={isSaving}
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Financial Goals */}
            {profile?.financialGoals && profile.financialGoals.length > 0 && (
                <div className="settings-section">
                    <h2 className="section-title">Financial Goals</h2>
                    <div className="goals-list">
                        {profile.financialGoals.map((goal, index) => (
                            <div key={index} className="goal-chip">
                                {goal}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
