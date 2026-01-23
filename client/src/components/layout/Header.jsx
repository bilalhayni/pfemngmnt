import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = ({ title, userName, userEmail, userInitials }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user, ROLES } = useAuth();

  // Determine profile route based on user role
  const getProfileRoute = () => {
    if (!user) return '/profile';
    switch (user.role) {
      case ROLES.PROFESSOR:
        return '/prof/profile';
      case ROLES.STUDENT:
        return '/student/profile';
      case ROLES.ADMIN:
        return '/admin/profile';
      case ROLES.CHEF_DEPARTEMENT:
        return '/profile';
      default:
        return '/profile';
    }
  };

  // Close dropdown when clicking outside or pressing ESC
  useEffect(() => {
    if (!isProfileOpen) return;

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isProfileOpen]);

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    await logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    navigate(getProfileRoute());
  };

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__title">{title}</h1>
      </div>

      <div className="header__right">
        <div className="header__user" ref={profileRef}>
          <div
            className={`header__avatar ${isProfileOpen ? 'header__avatar--active' : ''}`}
            role="button"
            tabIndex={0}
            aria-expanded={isProfileOpen}
            onClick={() => setIsProfileOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setIsProfileOpen((v) => !v);
            }}
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
