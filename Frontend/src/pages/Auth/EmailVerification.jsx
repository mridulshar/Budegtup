import React, { useState } from 'react';
import './Auth.css';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EmailVerification = ({ 
  email, 
  onEmailChange, 
  onVerificationSuccess, 
  onBack, 
  mode = "login", // "login" or "signup"
  initialEmail = "" 
}) => {
  const [currentMode, setCurrentMode] = useState("email"); // "email", "verify", "password"
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // If initialEmail is provided, use it
  const [localEmail, setLocalEmail] = useState(initialEmail);
  const currentEmail = email || localEmail;

  const handleEmailChange = (value) => {
    setLocalEmail(value);
    if (onEmailChange) onEmailChange(value);
  };

  const checkPassword = (pwd) => {
    setPassword(pwd);
    setRequirements({
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    });
  };

  const handleSendCode = async () => {
    if (!currentEmail) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "signup" 
        ? `${API_URL}/auth/email/signup`
        : `${API_URL}/auth/email/send-login-code`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: currentEmail,
          ...(mode === "signup" && { displayName: currentEmail.split('@')[0] })
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentMode("verify");
      } else {
        setError(data.message || "Failed to send verification code");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "signup"
        ? `${API_URL}/auth/email/verify-signup-code`
        : `${API_URL}/auth/email/verify-login-code`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: currentEmail, 
          code 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresPasswordSetup) {
          setCurrentMode("password");
        } else {
          onVerificationSuccess(data);
        }
      } else {
        setError(data.message || "Invalid verification code");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (!password) {
      setError("Please enter a password");
      return;
    }

    const allMet = Object.values(requirements).every(req => req === true);
    if (!allMet) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First set the password
      const setPasswordResponse = await fetch(`${API_URL}/auth/password/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: currentEmail, 
          password 
        }),
      });

      const setPasswordData = await setPasswordResponse.json();

      if (!setPasswordResponse.ok) {
        setError(setPasswordData.message || "Failed to set password");
        return;
      }

      // Then login with the new password
      const loginResponse = await fetch(`${API_URL}/auth/password/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: currentEmail, 
          password 
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        onVerificationSuccess(loginData);
      } else {
        setError(loginData.message || "Login failed after setting password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Email Input Mode
  if (currentMode === "email") {
    return (
      <div className="auth-form">
        <div className="form-header">
          <h2>{mode === "signup" ? "Sign up with Email" : "Sign in with Email"}</h2>
          <p>Enter your email — we'll send a verification code.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={currentEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
            disabled={loading}
            className="auth-input"
          />
        </div>

        <button 
          className="auth-btn primary" 
          onClick={handleSendCode} 
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Verification Code"}
        </button>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button className="link-btn" onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // Verification Code Mode
  if (currentMode === "verify") {
    return (
      <div className="auth-form">
        <div className="form-header">
          <h2>Enter Verification Code</h2>
          <p>Check your email for a 6-digit code.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Verification Code</label>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            maxLength={6}
            className="auth-input"
          />
        </div>

        <button 
          className="auth-btn primary" 
          onClick={handleVerifyCode}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button className="link-btn" onClick={() => setCurrentMode("email")}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // Password Setup Mode
  if (currentMode === "password") {
    return (
      <div className="auth-form">
        <div className="form-header">
          <h2>Set Your Password</h2>
          <p>Create a secure password for your account.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="email-verified">
          <i className="ri-checkbox-circle-fill"></i>
          <span>Email verified: {currentEmail}</span>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => checkPassword(e.target.value)}
            disabled={loading}
            className="auth-input"
          />
        </div>

        <div className="password-requirements">
          <p>Password must contain:</p>
          <div className={`requirement ${requirements.minLength ? "met" : ""}`}>
            <i className={requirements.minLength ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"}></i>
            <span>At least 8 characters</span>
          </div>
          <div className={`requirement ${requirements.hasUppercase ? "met" : ""}`}>
            <i className={requirements.hasUppercase ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"}></i>
            <span>One uppercase letter (A-Z)</span>
          </div>
          <div className={`requirement ${requirements.hasLowercase ? "met" : ""}`}>
            <i className={requirements.hasLowercase ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"}></i>
            <span>One lowercase letter (a-z)</span>
          </div>
          <div className={`requirement ${requirements.hasNumber ? "met" : ""}`}>
            <i className={requirements.hasNumber ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"}></i>
            <span>One number (0-9)</span>
          </div>
          <div className={`requirement ${requirements.hasSpecial ? "met" : ""}`}>
            <i className={requirements.hasSpecial ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"}></i>
            <span>One special character (!@#$%...)</span>
          </div>
        </div>

        <button
          className="auth-btn primary"
          onClick={handleSetPassword}
          disabled={loading || !Object.values(requirements).every(req => req)}
        >
          {loading ? "Setting up..." : "Complete Setup"}
        </button>
      </div>
    );
  }
};

export default EmailVerification;