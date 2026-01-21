import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, subtitle, icon, iconBgColor }) => {
  const renderIcon = () => {
    const icons = {
      professors: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      students: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      projects: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z" />
        </svg>
      ),
      domains: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    };
    return icons[icon] || null;
  };

  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        <div
          className="stat-card__icon"
          style={{ backgroundColor: iconBgColor || '#4f6bed' }}
        >
          {renderIcon()}
        </div>
      </div>
      <div className="stat-card__body">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__subtitle">{subtitle}</span>
      </div>
    </div>
  );
};

export default StatCard;
