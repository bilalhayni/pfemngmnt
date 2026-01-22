import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/api';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    availablePfes: 0,
    myApplications: 0,
    assignedPfe: false
  });
  const [loading, setLoading] = useState(true);

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Étudiant';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'ET';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await studentService.getStats();
        if (response?.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching student stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'PFEs Disponibles',
      value: stats.availablePfes,
      subtitle: 'Projets à postuler',
      icon: 'all-projects',
      iconBgColor: '#4f6bed'
    },
    {
      title: 'Mes Postulations',
      value: stats.myApplications,
      subtitle: 'En attente de réponse',
      icon: 'requests',
      iconBgColor: '#f59e0b'
    },
    {
      title: 'Mon PFE',
      value: stats.assignedPfe ? '1' : '0',
      subtitle: stats.assignedPfe ? 'Projet assigné' : 'Pas encore assigné',
      icon: 'folder',
      iconBgColor: stats.assignedPfe ? '#10b981' : '#94a3b8'
    }
  ];

  return (
    <Layout pageTitle="Dashboard Étudiant" userName={userName} userInitials={userInitials}>
      <div className="student-dashboard">
        <div className="student-dashboard__welcome">
          <h2 className="student-dashboard__greeting">
            Bienvenue, <span className="student-dashboard__name">{userName}</span>!
          </h2>
          <p className="student-dashboard__subtitle">
            Trouvez votre projet de fin d'études et suivez vos postulations.
          </p>
        </div>

        <div className={`student-dashboard__stats ${loading ? 'student-dashboard__stats--loading' : ''}`}>
          {statsCards.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={loading ? '-' : stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              iconBgColor={stat.iconBgColor}
            />
          ))}
        </div>

        <div className="student-dashboard__quick-actions">
          <h3>Actions Rapides</h3>
          <div className="student-dashboard__actions-grid">
            <a href="/student/pfe" className="student-action-card">
              <div className="student-action-card__icon" style={{ backgroundColor: '#4f6bed' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <span>Parcourir les PFEs</span>
            </a>
            <a href="/student/applications" className="student-action-card">
              <div className="student-action-card__icon" style={{ backgroundColor: '#f59e0b' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="9" x2="15" y2="9" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="15" x2="12" y2="15" />
                </svg>
              </div>
              <span>Mes postulations</span>
            </a>
            <a href="/student/mypfe" className="student-action-card">
              <div className="student-action-card__icon" style={{ backgroundColor: '#10b981' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span>Mon PFE</span>
            </a>
            <a href="/student/profile" className="student-action-card">
              <div className="student-action-card__icon" style={{ backgroundColor: '#8b5cf6' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span>Mon profil</span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
