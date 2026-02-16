import React, { useState, useEffect } from "react";
import { Menu, Sun, Moon, Plus, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { profileService } from "../../services";
import Sidebar from "../../components/layout/Sidebar";
import Overview from "./Overview";
import Create from "./Create";
import UploadDocuments from "./Upload";
import Goals from "./Goals";
import Profile from "../Profile/Profile";
import Settings from "./Settings";
import SetPasswordModal from "../../components/auth/SetPasswordModal";
import AIAgentWidget from "../../components/features/AIAgent/AIAgentWidget";
import "./Dashboard.css";

export default function Dashboard() {
  const [active, setActive] = useState("overview");
  const [profileImageError, setProfileImageError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [hasCheckedPassword, setHasCheckedPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, currentUser, logout: authLogout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-display')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  useEffect(() => { if (!isLoggedIn) navigate("/"); }, [isLoggedIn, navigate]);

  useEffect(() => {
    const checkPasswordStatus = async () => {
      if (isLoggedIn && !hasCheckedPassword && currentUser?.authProvider === 'google') {
        try {
          const response = await profileService.getProfile();
          if (!response.data.hasSetPassword) setTimeout(() => setShowSetPasswordModal(true), 1500);
          setHasCheckedPassword(true);
        } catch (error) { setHasCheckedPassword(true); }
      }
    };
    checkPasswordStatus();
  }, [isLoggedIn, currentUser, hasCheckedPassword]);

  const logout = () => { authLogout(); navigate("/"); };
  const username = currentUser?.name || currentUser?.displayName || "User";
  const hasProfileImage = currentUser?.picture || currentUser?.photoURL;
  const profileImage = hasProfileImage ? currentUser.picture || currentUser.photoURL : null;
  const handleImageError = () => setProfileImageError(true);
  const getInitials = () => username.split(" ").map((n) => n[0]).join("").toUpperCase();
  const handlePasswordSet = async () => {
    try {
      await profileService.getProfile();
      updateUser({ hasSetPassword: true });
    } catch (error) {
      console.error('Password set error:', error);
    }
  };

  const handleTransactionSuccess = () => {
    setRefreshKey(prev => prev + 1); // Trigger refresh
    setShowCreateModal(false);
  };

  const renderContent = () => {
    switch (active) {
      case "overview": return <Overview key={refreshKey} onAddTransaction={() => setShowCreateModal(true)} />;
      case "upload": return <UploadDocuments />;
      case "goals": return <Goals />;
      case "profile": return <Profile user={currentUser} onLogout={logout} updateUser={updateUser} />;
      case "settings": return <Settings />;
      default: return <Overview key={refreshKey} onAddTransaction={() => setShowCreateModal(true)} />;
    }
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      <Sidebar
        active={active}
        setActive={setActive}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={logout}
        onThemeToggle={toggleTheme}
        theme={theme}
        user={currentUser}
        onCreate={() => setShowCreateModal(true)}
      />

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="topbar-left">
            {isMobile && <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={24} /></button>}
            {isMobile && <span className="mobile-brand">BudgetUp</span>}
          </div>

          <div className="topbar-right">
            {!isMobile && (
              <button className="create-btn-top" onClick={() => setShowCreateModal(true)}>
                <Plus size={18} />
                <span>Create</span>
              </button>
            )}

            <button className="icon-btn theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="profile-display" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className={`profile-pill ${isProfileOpen ? 'active' : ''}`}>
                {hasProfileImage && !profileImageError ?
                  <img src={profileImage} alt={username} className="profile-pic" onError={handleImageError} />
                  : <div className="profile-pic initials-avatar">{getInitials()}</div>
                }
                {!isMobile && <span className="username">{username}</span>}
              </div>

              {isProfileOpen && (
                <div className="profile-dropdown">
                  {isMobile && (
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive('settings');
                        setIsProfileOpen(false);
                      }}
                    >
                      <SettingsIcon size={16} />
                      <span>Settings</span>
                    </button>
                  )}
                  <button
                    className="dropdown-item logout"
                    onClick={(e) => {
                      e.stopPropagation();
                      logout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <main className="dashboard-content">{renderContent()}</main>
      </div>

      {isMobile && <button className="fab-create" onClick={() => setShowCreateModal(true)} aria-label="Create transaction"><Plus size={24} /></button>}
      <Create
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleTransactionSuccess}
      />
      <SetPasswordModal isOpen={showSetPasswordModal} onClose={() => setShowSetPasswordModal(false)} onPasswordSet={handlePasswordSet} />
      <AIAgentWidget />
    </div>
  );
}