import React, { useState } from 'react';
import { X, Eye, EyeOff, Check, AlertCircle, Lock } from 'lucide-react';
import profileService from "../../services/profileService";
import './SetPasswordModal.css';

export default function SetPasswordModal({ isOpen, onClose, onPasswordSet }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Password strength calculation
    const getPasswordStrength = () => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 10) strength += 15;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
        if (/\d/.test(password)) strength += 20;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 20;

        if (strength < 40) return { strength, label: 'Weak', color: '#FF6B6B' };
        if (strength < 70) return { strength, label: 'Medium', color: '#FFB547' };
        return { strength, label: 'Strong', color: '#4ECDC4' };
    };

    const strengthInfo = getPasswordStrength();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await profileService.setPassword(password);
            setSuccess(true);

            setTimeout(() => {
                if (onPasswordSet) onPasswordSet();
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to set password');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="set-password-modal" onClick={(e) => e.stopPropagation()}>
                {!success ? (
                    <>
                        <div className="modal-header">
                            <div className="header-icon">
                                <Lock size={32} />
                            </div>
                            <h2>Set Your Password 🔐</h2>
                            <p>Add an extra layer of security to your account</p>
                            <button className="close-btn" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            {error && (
                                <div className="error-message">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label>New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="password-input"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="toggle-password"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {password && (
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div
                                                className="strength-fill"
                                                style={{
                                                    width: `${strengthInfo.strength}%`,
                                                    background: strengthInfo.color
                                                }}
                                            />
                                        </div>
                                        <span className="strength-label" style={{ color: strengthInfo.color }}>
                                            {strengthInfo.label}
                                        </span>
                                    </div>
                                )}

                                <ul className="password-requirements">
                                    <li className={password.length >= 6 ? 'valid' : ''}>
                                        {password.length >= 6 ? <Check size={14} /> : <span className="bullet">•</span>}
                                        At least 6 characters
                                    </li>
                                    <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'valid' : ''}>
                                        {/[A-Z]/.test(password) && /[a-z]/.test(password) ? <Check size={14} /> : <span className="bullet">•</span>}
                                        Uppercase and lowercase letters
                                    </li>
                                    <li className={/\d/.test(password) ? 'valid' : ''}>
                                        {/\d/.test(password) ? <Check size={14} /> : <span className="bullet">•</span>}
                                        At least one number
                                    </li>
                                </ul>
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        className="password-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="toggle-password"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <span className="password-mismatch">Passwords do not match</span>
                                )}
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading || password.length < 6 || password !== confirmPassword}
                                >
                                    {loading ? 'Setting Password...' : 'Set Password'}
                                </button>
                                <button type="button" onClick={handleSkip} className="btn-secondary">
                                    Skip for Now
                                </button>
                            </div>

                            <p className="helper-text">
                                You can always set your password later in Profile Settings
                            </p>
                        </form>
                    </>
                ) : (
                    <div className="success-state">
                        <div className="success-icon">
                            <Check size={48} />
                        </div>
                        <h2>Password Set Successfully! ✅</h2>
                        <p>Your account is now more secure</p>
                    </div>
                )}
            </div>
        </div>
    );
}
