import React, { useState, useEffect } from 'react';
import { Monitor, ClipboardList, Folder, User } from 'lucide-react';
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
      iconBgColor: '#a65b43'
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
              <div className="student-action-card__icon" style={{ backgroundColor: '#a65b43' }}>
                <Monitor size={24} />
              </div>
              <span>Parcourir les PFEs</span>
            </a>
            <a href="/student/applications" className="student-action-card">
              <div className="student-action-card__icon" style={{ backgroundColor: '#f59e0b' }}>
                <ClipboardList size={24} />
              </div>
              <span>Mes postulations</span>
            </a>
            <a href="/student/mypfe" className="student-action-card">
              <div className="student-action-card__icon" style={{ backgroundColor: '#10b981' }}>
                <Folder size={24} />
              </div>
              <span>Mon PFE</span>
            </a>
            <a href="/student/profile" className="student-action-card">
              <div className="student-action-card__icon" style={{ backgroundColor: '#8b5cf6' }}>
                <User size={24} />
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
