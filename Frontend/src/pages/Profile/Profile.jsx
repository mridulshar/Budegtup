import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, Bell, Palette, LogOut, Camera, Edit2, Save, X } from 'lucide-react';
import { profileService } from '../../services';
import SetPasswordModal from '../../components/auth/SetPasswordModal';
import './Profile.css';

export default function Profile({ user, onLogout, updateUser }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Edit form state
    const [formData, setFormData] = useState({
        displayName: '',
        firstName: '',
        lastName: '',
        email: ''
    });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await profileService.getProfile();
            setProfile(response.data);
            setFormData({
                displayName: response.data.displayName || '',
                firstName: response.data.firstName || '',
                lastName: response.data.lastName || '',
                email: response.data.email || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await profileService.updateProfile(formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setProfile(response.data);
            setEditMode(false);
            if (updateUser) updateUser(response.data);

            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        try {
            await profileService.changePassword(passwordData.oldPassword, passwordData.newPassword);
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });

            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
        }
    };

    const handleSetPassword = () => {
        setShowPasswordModal(true);
    };

    const handlePasswordSet = async () => {
        // Refresh profile after password is set
        await fetchProfile();
        if (updateUser) {
            const response = await profileService.getProfile();
            updateUser(response.data);
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <div className="profile-header-content">
                    <h1>Profile Settings</h1>
                    <p>Manage your account settings and preferences</p>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Profile Card */}
            <div className="profile-card">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        {profile?.profilePicUrl ? (
                            <img src={profile.profilePicUrl} alt={profile.name} />
                        ) : (
                            <User size={48} />
                        )}
                    </div>
                    <div className="profile-info">
                        <h2>{profile?.name || 'User'}</h2>
                        <p>{profile?.email}</p>
                        <span className="auth-badge">
                            {profile?.authProvider === 'google' ? '🔐 Google Account' : '🔐 Email Account'}
                        </span>
                    </div>
                </div>
            </div>

            {/* General Settings */}
            <div className="settings-section">
                <div className="section-header">
                    <User size={20} />
                    <h3>General Information</h3>
                    {!editMode ? (
                        <button onClick={() => setEditMode(true)} className="edit-btn">
                            <Edit2 size={16} />
                            Edit
                        </button>
                    ) : (
                        <div className="edit-actions">
                            <button onClick={handleUpdateProfile} className="save-btn">
                                <Save size={16} />
                                Save
                            </button>
                            <button onClick={() => {
                                setEditMode(false);
                                setFormData({
                                    displayName: profile.displayName || '',
                                    firstName: profile.firstName || '',
                                    lastName: profile.lastName || '',
                                    email: profile.email || ''
                                });
                            }} className="cancel-btn">
                                <X size={16} />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="settings-content">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Display Name</label>
                            <input
                                type="text"
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                disabled={!editMode}
                                placeholder="Your display name"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                disabled={!editMode}
                                placeholder="First name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                disabled={!editMode}
                                placeholder="Last name"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={!editMode}
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="settings-section">
                <div className="section-header">
                    <Shield size={20} />
                    <h3>Security</h3>
                </div>

                <div className="settings-content">
                    {profile?.hasSetPassword ? (
                        <>
                            <h4>Change Password</h4>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                        placeholder="Enter current password"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                            <button onClick={handleChangePassword} className="btn-primary">
                                <Lock size={16} />
                                Change Password
                            </button>
                        </>
                    ) : (
                        <div className="no-password-state">
                            <Lock size={32} />
                            <h4>No Password Set</h4>
                            <p>You signed up with Google. Set a password for additional security.</p>
                            <button onClick={handleSetPassword} className="btn-primary">
                                Set Password
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Account Actions */}
            <div className="settings-section danger-zone">
                <div className="section-header">
                    <LogOut size={20} />
                    <h3>Account Actions</h3>
                </div>

                <div className="settings-content">
                    <button onClick={onLogout} className="btn-logout">
                        <LogOut size={16} />
                        Log Out
                    </button>
                </div>
            </div>

            {/* Set Password Modal */}
            <SetPasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onPasswordSet={handlePasswordSet}
            />
        </div>
    );
}
