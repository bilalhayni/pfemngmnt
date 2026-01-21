import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ title, userName, userEmail, userInitials }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log('Signing out...');
    setIsProfileOpen(false);
    navigate('/login');
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__title">{title}</h1>
      </div>

      <div className="header__right">
        <button className="header__notification" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="header__notification-badge"></span>
        </button>

        <div className="header__user" ref={profileRef}>
          <div
            className={`header__avatar ${isProfileOpen ? 'header__avatar--active' : ''}`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {userInitials || userName?.slice(0, 2).toUpperCase() || 'US'}
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown__header">
                <div className="profile-dropdown__avatar">
                  {userInitials || userName?.slice(0, 2).toUpperCase() || 'US'}
                </div>
                <div className="profile-dropdown__info">
                  <span className="profile-dropdown__name">{userName || 'Utilisateur'}</span>
                  <span className="profile-dropdown__email">{userEmail || 'email@example.com'}</span>
                </div>
              </div>

              <div className="profile-dropdown__divider"></div>

              <ul className="profile-dropdown__menu">
                <li>
                  <button className="profile-dropdown__item" onClick={handleProfileClick}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Mon Profil
                  </button>
                </li>
                <li>
                  <button className="profile-dropdown__item" onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Paramètres
                  </button>
                </li>
              </ul>

              <div className="profile-dropdown__divider"></div>

              <button className="profile-dropdown__signout" onClick={handleSignOut}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
