import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
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
                    <User size={18} />
                    Mon Profil
                  </button>
                </li>
              </ul>

              <div className="profile-dropdown__divider"></div>

              <button className="profile-dropdown__signout" onClick={handleSignOut}>
                <LogOut size={18} />
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
