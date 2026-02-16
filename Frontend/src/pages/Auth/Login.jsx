import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";
import axios from "axios";

const Login = ({ onSwitchToSignup, onLoginSuccess }) => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [isLoggedIn, onLoginSuccess]);

  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Google login
  const handleGoogleSuccess = (data) => {
    if (data.token && data.user) {
      login(data.token, data.user);
      if (onLoginSuccess) onLoginSuccess();
      setTimeout(() => navigate('/dashboard'), 500);
    }
  };

  // Email & Password Login
  const handlePasswordLogin = async () => {
    // Clear messages
    setError("");
    setSuccess("");

    // Validation
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    // Send to backend
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email.trim(),
        password: password
      });

      console.log("Login success:", response.data);

      // If backend returns token and user
      if (response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
        setSuccess("Login successful!");

        if (onLoginSuccess) onLoginSuccess();

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setError("Invalid response from server");
      }

    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Invalid email or password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handlePasswordLogin();
    }
  };

  return (
    <div className="budgetup-auth-form">
      <div className="budgetup-form-header">
        <h2>Welcome back</h2>
        <p>Log in to continue to BudgetUp.</p>
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
          autoFocus
        />
      </div>

      {/* Password field */}
      <div className="budgetup-form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="budgetup-auth-input"
        />
      </div>

      {/* Remember me & Forgot password */}
      <div className="budgetup-form-meta">
        <label className="budgetup-remember">
          <input type="checkbox" /> Remember me
        </label>
        <button
          className="budgetup-link-btn"
          onClick={() => alert("Forgot password feature coming soon!")}
        >
          Forgot password?
        </button>
      </div>

      {/* Login button */}
      <button
        className="budgetup-auth-btn budgetup-primary"
        onClick={handlePasswordLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      {/* Switch to signup */}
      <div className="budgetup-form-footer">
        <span>Don't have an account?</span>
        <button onClick={onSwitchToSignup}>Sign up</button>
      </div>
    </div>
  );
};

export default Login;
