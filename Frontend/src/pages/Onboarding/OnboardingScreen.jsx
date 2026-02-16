import React from "react";
import { useAuth } from "../../context/AuthContext";
import OnboardingModal from "../../components/features/Onboarding/OnboardingModal";
import "./OnboardingScreen.css";

export default function OnboardingScreen() {
  const { token } = useAuth();

  const handleOnboardingComplete = async (formData) => {
    try {
      console.log("🚀 Sending onboarding data to backend:", formData);

      const response = await fetch("http://localhost:5000/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Backend response:", result);

      // Use window.location to completely refresh app state
      window.location.href = "/dashboard";

    } catch (err) {
      console.error("❌ Save error:", err);
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="onboarding-screen">
      <OnboardingModal
        isOpen={true}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}