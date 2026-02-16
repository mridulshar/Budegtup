import React, { useState, useEffect } from "react";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({ onSwitchToLogin, onSignupSuccess }) => {
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // Form data
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (isLoggedIn && onSignupSuccess) {
            onSignupSuccess();
        }
    }, [isLoggedIn, onSignupSuccess]);

    // Google signup
    const handleGoogleSuccess = (data) => {
        if (data.token && data.user) {
            login(data.token, data.user);
            if (onSignupSuccess) onSignupSuccess();
            setTimeout(() => navigate('/dashboard'), 1000);
        }
    };

    // Email & Password Signup
    const handleEmailPasswordSignup = async () => {
        // Clear messages
        setError("");
        setSuccess("");

        // Validation
        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }

        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email");
            return;
        }

        if (!password) {
            setError("Please enter a password");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Send to backend
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                email: email.trim(),
                name: name.trim(),
                password: password
            });

            console.log("Signup success:", response.data);

            setSuccess("Account created successfully!");

            // Auto-login after signup
            if (response.data.token && response.data.user) {
                login(response.data.token, response.data.user);

                // Navigate to onboarding
                setTimeout(() => {
                    if (onSignupSuccess) onSignupSuccess();
                    navigate("/onboarding");
                }, 500);
            } else {
                // Fallback: switch to login
                setTimeout(() => {
                    onSwitchToLogin();
                }, 1500);
            }

        } catch (err) {
            console.error("Signup error:", err);
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleEmailPasswordSignup();
        }
    };

    return (
        <div className="budgetup-auth-form">
            <div className="budgetup-form-header">
                <h2>Create your account</h2>
                <p>Sign up to get started with BudgetUp.</p>
            </div>

            {/* Error message */}
            {error && (
                <div className="budgetup-error-message">
                    {error}
                </div>
            )}

            {/* Success message */}
            {success && (
                <div style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: '#86efac',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                }}>
                    {success}
                </div>
            )}

            {/* Google button */}
            <div className="budgetup-google-btn-container">
                <GoogleAuthButton onSuccessCallback={handleGoogleSuccess} />
            </div>

            <div className="budgetup-or-sep">
                <span>or</span>
            </div>

            {/* Name field */}
            <div className="budgetup-form-group">
                <label>Full Name</label>
                <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="budgetup-auth-input"
                    autoFocus
                />
            </div>

            {/* Email field */}
            <div className="budgetup-form-group">
                <label>Email</label>
                <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="budgetup-auth-input"
                />
            </div>

            {/* Password field */}
            <div className="budgetup-form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="budgetup-auth-input"
                />
            </div>

            {/* Confirm password field */}
            <div className="budgetup-form-group">
                <label>Confirm Password</label>
                <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="budgetup-auth-input"
                />
            </div>

            {/* Sign up button */}
            <button
                className="budgetup-auth-btn budgetup-primary"
                onClick={handleEmailPasswordSignup}
                disabled={loading}
            >
                {loading ? 'Creating account...' : 'Sign up'}
            </button>

            {/* Switch to login */}
            <div className="budgetup-form-footer">
                <span>Already have an account?</span>
                <button onClick={onSwitchToLogin}>Log in</button>
            </div>
        </div>
    );
};

export default Signup;