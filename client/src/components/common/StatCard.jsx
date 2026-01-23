import React from 'react';
import PropTypes from 'prop-types';
import { Users, User, Briefcase, LayoutGrid, TrendingUp, CheckCircle } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ title, value, subtitle, icon, iconBgColor }) => {
  const icons = {
    professors: <Users size={24} />,
    students: <User size={24} />,
    projects: <Briefcase size={24} />,
    domains: <LayoutGrid size={24} />,
    progress: <TrendingUp size={24} />,
    check: <CheckCircle size={24} />
  };

  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        <div
          className="stat-card__icon"
          style={{ backgroundColor: iconBgColor || '#a65b43' }}
        >
          {icons[icon] || null}
        </div>
      </div>
      <div className="stat-card__body">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__subtitle">{subtitle}</span>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.oneOf(['professors', 'students', 'projects', 'domains', 'progress', 'check']),
  iconBgColor: PropTypes.string
};

StatCard.defaultProps = {
  subtitle: '',
  icon: 'projects',
  iconBgColor: '#a65b43'
};

export default StatCard;
