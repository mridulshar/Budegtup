import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Login from "../../pages/Auth/Login.jsx";
import Signup from "../../pages/Auth/Signup.jsx";
import "./Modal.css";
import "../../pages/Auth/Auth.css";

function Modals({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // ADD THIS - Handle successful auth
  const handleAuthSuccess = () => {
    onClose?.(); // Close the modal on successful login/signup
  };

  useEffect(() => {
    if (!isOpen) return;

    setIsLogin(true);
    previouslyFocusedRef.current = document.activeElement;

    const focusDialog = () => {
      const focusables = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables && focusables.length) {
        focusables[0].focus();
      } else {
        dialogRef.current?.focus();
      }
    };

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const timeout = setTimeout(focusDialog, 20);

    return () => {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (top) window.scrollTo(0, parseInt(top || "0") * -1);

      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus();
      }
      clearTimeout(timeout);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
      } else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;

        const list = Array.from(focusables);
        const first = list[0];
        const last = list[list.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown, true);
    return () => document.removeEventListener("keydown", handleKeydown, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (e) => {
    if (e.target === overlayRef.current) {
      onClose?.();
    }
  };

  const modal = (
    <div
      ref={overlayRef}
      className="auth-modal-overlay"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        ref={dialogRef}
        className="auth-modal-container"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <button className="auth-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="auth-modal-tabs">
          <button
            className={`auth-tab-btn ${isLogin ? "auth-tab-active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Log in
          </button>
          <button
            className={`auth-tab-btn ${!isLogin ? "auth-tab-active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign up
          </button>
        </div>

        <div className="auth-modal-content">
          {isLogin ? (
            <Login
              onSwitchToSignup={() => setIsLogin(false)}
              onLoginSuccess={handleAuthSuccess}
            />
          ) : (
            <Signup
              onSwitchToLogin={() => setIsLogin(true)}
              onSignupSuccess={handleAuthSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default Modals;