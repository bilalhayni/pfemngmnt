import React, { useState, useEffect } from 'react';
import { FilePlus, ClipboardList, Folder, Users } from 'lucide-react';
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
      iconBgColor: '#a65b43'
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
              <div className="professor-action-card__icon" style={{ backgroundColor: '#a65b43' }}>
                <FilePlus size={24} />
              </div>
              <span>Créer un PFE</span>
            </a>
            <a href="/prof/demandes" className="professor-action-card">
              <div className="professor-action-card__icon" style={{ backgroundColor: '#f59e0b' }}>
                <ClipboardList size={24} />
              </div>
              <span>Voir les demandes</span>
            </a>
            <a href="/prof/pfe" className="professor-action-card">
              <div className="professor-action-card__icon" style={{ backgroundColor: '#10b981' }}>
                <Folder size={24} />
              </div>
              <span>Mes PFEs</span>
            </a>
            <a href="/prof/students" className="professor-action-card">
              <div className="professor-action-card__icon" style={{ backgroundColor: '#8b5cf6' }}>
                <Users size={24} />
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
