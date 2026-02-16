import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

import Header from "./components/layout/Header.jsx";
import Home from "./pages/Landing/Home.jsx";
import HowItWorks from "./pages/Landing/HowItWorks.jsx";
import Features from "./pages/Landing/Features.jsx";
import CTA from "./components/common/Cta.jsx";
import Modal from "./components/common/Modal"; // Import Modal

import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import OnboardingScreen from "./pages/Onboarding/OnboardingScreen.jsx";

import "./App.css";

function App() {
  const { isLoggedIn, isLoading, token } = useAuth();
  const { theme } = useTheme();
  const [appStatus, setAppStatus] = useState('checking'); // 'checking', 'landing', 'onboarding', 'dashboard'
  const [isModalOpen, setModalOpen] = useState(false); // Lifted Modal State

  const openAuthModal = () => setModalOpen(true);

  // Check onboarding status in background - NO LOADING SCREEN
  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        setAppStatus('landing');
        return;
      }

      // If logged in, check onboarding status silently
      const checkOnboardingStatus = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/user/onboarding/status", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });

          if (response.ok) {
            const status = await response.json();

            if (status.needsOnboarding) {
              setAppStatus('onboarding');
            } else {
              setAppStatus('dashboard');
            }
          } else {
            setAppStatus('onboarding'); // Default to onboarding on error
          }
        } catch (error) {
          setAppStatus('onboarding'); // Default to onboarding on error
        }
      };

      checkOnboardingStatus();
    }
  }, [isLoggedIn, isLoading, token]);

  // Show NOTHING while checking - completely blank
  if (isLoading || appStatus === 'checking') {
    return null; // 👈 NO LOADING SCREEN - JUST BLANK
  }

  return (
    <div className={`app ${theme}`}>
      <Routes>
        {/* Public Landing Page - Show immediately if not logged in */}
        <Route
          path="/"
          element={
            appStatus === 'landing' ? (
              <>
                <Header openAuthModal={openAuthModal} />
                <Home openAuthModal={openAuthModal} />
                <HowItWorks />
                <Features />
                <CTA openAuthModal={openAuthModal} />
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
              </>
            ) : appStatus === 'onboarding' ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Onboarding Route */}
        <Route
          path="/onboarding"
          element={
            appStatus === 'onboarding' ? (
              <OnboardingScreen />
            ) : appStatus === 'dashboard' ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            appStatus === 'dashboard' ? (
              <Dashboard />
            ) : appStatus === 'onboarding' ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={
            appStatus === 'landing' ? (
              <Navigate to="/" replace />
            ) : appStatus === 'onboarding' ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;