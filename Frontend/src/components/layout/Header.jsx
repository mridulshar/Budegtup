import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import "./Header.css";

const Header = ({ openAuthModal }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (window.scrollY > 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header>
        <div className="header-container">
          <div className="logo">
            <h1>BudgetUp</h1>
          </div>

          <nav className={isMenuOpen ? "active" : ""}>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>

            {/* Mobile auth link - only shows in dropdown */}
            <a
              href="#login"
              className="mobile-auth-link"
              onClick={(e) => {
                e.preventDefault();
                openAuthModal();
                setIsMenuOpen(false);
              }}
            >
              <i className="ri-user-add-line"></i>
              Login / Sign Up
            </a>
          </nav>

          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === "light" ? (
              <i className="fas fa-moon theme-icon"></i>
            ) : (
              <i className="fas fa-sun theme-icon"></i>
            )}
          </button>

          {/* Desktop auth button */}
          <div className="auth-btn">
            <button onClick={openAuthModal}>
              <i className="ri-user-add-line"></i>
            </button>
          </div>

          <div
            className={`mobile-toggle ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;