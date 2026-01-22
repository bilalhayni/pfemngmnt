import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    professors: 0,
    chefDepartements: 0,
    students: 0,
    pendingStudents: 0,
    filieres: 0
  });
  const [loading, setLoading] = useState(true);

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Admin';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'AD';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        if (response?.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Professeurs',
      value: stats.professors,
      subtitle: 'Total des professeurs',
      icon: 'professors',
      iconBgColor: '#4f6bed'
    },
    {
      title: 'Chefs de Département',
      value: stats.chefDepartements,
      subtitle: 'Total des chefs',
      icon: 'professors',
      iconBgColor: '#10b981'
    },
    {
      title: 'Étudiants Actifs',
      value: stats.students,
      subtitle: 'Comptes activés',
      icon: 'students',
      iconBgColor: '#f59e0b'
    },
    {
      title: 'En Attente',
      value: stats.pendingStudents,
      subtitle: 'Demandes d\'activation',
      icon: 'students',
      iconBgColor: '#ef4444'
    }
  ];

  return (
    <Layout pageTitle="Dashboard Admin" userName={userName} userInitials={userInitials}>
      <div className="admin-dashboard">
        <div className="admin-dashboard__welcome">
          <h2 className="admin-dashboard__greeting">
            Bienvenue, <span className="admin-dashboard__name">{userName}</span>!
          </h2>
          <p className="admin-dashboard__subtitle">
            Panneau d'administration - Gérez les utilisateurs et les paramètres du système.
          </p>
        </div>

        <div className={`admin-dashboard__stats ${loading ? 'admin-dashboard__stats--loading' : ''}`}>
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

        <div className="admin-dashboard__quick-actions">
          <h3>Actions Rapides</h3>
          <div className="admin-dashboard__actions-grid">
            <a href="/admin/pending-students" className="admin-action-card">
              <div className="admin-action-card__icon" style={{ backgroundColor: '#ef4444' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <span>Activer les comptes</span>
            </a>
            <a href="/admin/create-account" className="admin-action-card">
              <div className="admin-action-card__icon" style={{ backgroundColor: '#4f6bed' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <span>Créer un compte</span>
            </a>
            <a href="/admin/professors" className="admin-action-card">
              <div className="admin-action-card__icon" style={{ backgroundColor: '#10b981' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span>Gérer les professeurs</span>
            </a>
            <a href="/admin/create-filiere" className="admin-action-card">
              <div className="admin-action-card__icon" style={{ backgroundColor: '#f59e0b' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
              </div>
              <span>Ajouter une filière</span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
