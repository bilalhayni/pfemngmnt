import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNavigationByRole, getIcon } from '../../config';
import './Navbar.css';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  // Get navigation config based on user role
  const menuItems = getNavigationByRole(user?.role);

  const renderMenuSection = (title, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="navbar__section">
        <span className="navbar__section-title">{title}</span>
        <ul className="navbar__menu">
          {items.map((item) => (
            <li key={item.path} className="navbar__menu-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                <span className="navbar__link-icon">{getIcon(item.icon)}</span>
                <span className="navbar__link-text">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <nav className={`navbar ${isCollapsed ? 'navbar--collapsed' : ''}`} aria-label="Main navigation">
      <div className="navbar__header">
        <div className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="3" y="3" width="8" height="8" rx="2" />
              <rect x="13" y="3" width="8" height="8" rx="2" />
              <rect x="3" y="13" width="8" height="8" rx="2" />
              <rect x="13" y="13" width="8" height="8" rx="2" />
            </svg>
          </div>
          <span className="navbar__logo-text">PFE Manager</span>
        </div>
        <button
          className="navbar__toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-expanded={!isCollapsed}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <div className="navbar__content">
        {renderMenuSection('PRINCIPAL', menuItems.principal)}
        {renderMenuSection('LISTES', menuItems.listes)}
        {renderMenuSection('UTILE', menuItems.utile)}
      </div>
    </nav>
  );
};

export default Navbar;
