import React from 'react';
import { Home, Target, Upload, Settings, X, LogOut } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ active, setActive, isMobile, isOpen, onClose, onLogout, onThemeToggle, theme, user, onCreate }) {

    const handleNavClick = (key) => {
        setActive(key);
        if (isMobile && onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div className="sidebar-overlay" onClick={onClose}></div>
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isMobile ? 'mobile' : ''} ${isMobile && isOpen ? 'open' : ''}`}>
                {/* Close button for mobile */}
                {isMobile && (
                    <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
                        <X size={24} />
                    </button>
                )}

                {/* Brand Name */}
                <div className="sidebar-brand">
                    BudgetUp
                </div>

                {/* MAIN NAVIGATION */}
                <div className="sidebar-main-nav">
                    <button
                        className={`nav-item ${active === 'overview' ? 'active' : ''}`}
                        onClick={() => handleNavClick('overview')}
                    >
                        <Home size={24} />
                        <span>Overview</span>
                    </button>
                    <button
                        className={`nav-item ${active === 'goals' ? 'active' : ''}`}
                        onClick={() => handleNavClick('goals')}
                    >
                        <Target size={24} />
                        <span>Goals</span>
                    </button>
                    <button
                        className={`nav-item ${active === 'upload' ? 'active' : ''}`}
                        onClick={() => handleNavClick('upload')}
                    >
                        <Upload size={24} />
                        <span>Upload</span>
                    </button>
                </div>

                {/* BOTTOM SECTION - Settings & Logout (Logout hidden on desktop) */}
                <div className="sidebar-bottom-nav">
                    <button
                        className={`nav-item ${active === 'settings' ? 'active' : ''}`}
                        onClick={() => handleNavClick('settings')}
                    >
                        <Settings size={24} />
                        <span>Settings</span>
                    </button>
                    {/* Logout button - only show on mobile */}
                    {isMobile && (
                        <button
                            className="nav-item logout-btn"
                            onClick={onLogout}
                        >
                            <LogOut size={24} />
                            <span>Logout</span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}