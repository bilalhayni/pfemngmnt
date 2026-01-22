import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { professorPortalService } from '../../services/api';
import Cookies from 'js-cookie';
import './ProfessorDashboard.css';

const ProfessorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myPfes: 0,
    pendingRequests: 0,
    assignedStudents: 0
  });
  const [loading, setLoading] = useState(true);

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Professeur';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'PR';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userId = Cookies.get('userId');
        const response = await professorPortalService.getStats(userId);
        if (response?.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching professor stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Mes PFEs',
      value: stats.myPfes,
      subtitle: 'Projets créés',
      icon: 'folder',
      iconBgColor: '#4f6bed'
    },
    {
      title: 'Demandes',
      value: stats.pendingRequests,
      subtitle: 'En attente de réponse',
      icon: 'requests',
      iconBgColor: '#f59e0b'
    },
    {
      title: 'Étudiants',
      value: stats.assignedStudents,
      subtitle: 'Étudiants encadrés',
      icon: 'students',
      iconBgColor: '#10b981'
    }
  ];

  return (
    <Layout pageTitle="Dashboard Professeur" userName={userName} userInitials={userInitials}>
      <div className="professor-dashboard">
        <div className="professor-dashboard__welcome">
          <h2 className="professor-dashboard__greeting">
            Bienvenue, <span className="professor-dashboard__name">{userName}</span>!
          </h2>
          <p className="professor-dashboard__subtitle">
            Gérez vos projets de fin d'études et suivez les demandes des étudiants.
          </p>
        </div>

        <div className={`professor-dashboard__stats ${loading ? 'professor-dashboard__stats--loading' : ''}`}>
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

        <div className="professor-dashboard__quick-actions">
          <h3>Actions Rapides</h3>
          <div className="professor-dashboard__actions-grid">
            <a href="/prof/pfe/new" className="professor-action-card">
              <div className="professor-action-card__icon" style={{ backgroundColor: '#4f6bed' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <span>Créer un PFE</span>
            </a>
            <a href="/prof/demandes" className="professor-action-card">
              <div className="professor-action-card__icon" style={{ backgroundColor: '#f59e0b' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="9" x2="15" y2="9" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="15" x2="12" y2="15" />
                </svg>
              </div>
              <span>Voir les demandes</span>
            </a>
            <a href="/prof/pfe" className="professor-action-card">
              <div className="professor-action-card__icon" style={{ backgroundColor: '#10b981' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span>Mes PFEs</span>
            </a>
            <a href="/prof/students" className="professor-action-card">
              <div className="professor-action-card__icon" style={{ backgroundColor: '#8b5cf6' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span>Mes étudiants</span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfessorDashboard;
