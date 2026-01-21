import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/common/StatCard';
import ProgressChart from '../components/common/ProgressChart';
import { useAuth } from '../context/AuthContext';
import { statsService, pfeService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pfeStats, setPfeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User info from auth context or fallback
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Utilisateur';
  const userEmail = user?.email || '';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'U';

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch dashboard stats and PFE data in parallel
        const [dashboardResponse, pfeResponse] = await Promise.all([
          statsService.getDashboard().catch(() => null),
          pfeService.getAll().catch(() => null)
        ]);

        // Process dashboard stats
        if (dashboardResponse?.data) {
          setStats(dashboardResponse.data);
        }

        // Process PFE data for charts
        if (pfeResponse?.data) {
          const pfes = Array.isArray(pfeResponse.data) ? pfeResponse.data : [];
          const inProgress = pfes.filter(pfe => pfe.status === 'en_cours' || pfe.progress < 100).length;
          const completed = pfes.filter(pfe => pfe.status === 'termine' || pfe.progress === 100).length;
          setPfeStats({ inProgress, completed, total: pfes.length });
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Stats cards data - use API data or fallback to 0
  const statsCards = [
    {
      title: 'Professeurs',
      value: stats?.professorsCount ?? 0,
      subtitle: 'Membres actifs',
      icon: 'professors',
      iconBgColor: '#4f6bed'
    },
    {
      title: 'Étudiants',
      value: stats?.studentsCount ?? 0,
      subtitle: 'Inscrits en PFE',
      icon: 'students',
      iconBgColor: '#f59e0b'
    },
    {
      title: 'Projets PFE',
      value: stats?.pfesCount ?? pfeStats?.total ?? 0,
      subtitle: 'Actifs & terminés',
      icon: 'projects',
      iconBgColor: '#10b981'
    },
    {
      title: 'Domaines',
      value: stats?.domainsCount ?? 0,
      subtitle: 'Spécialités PFE',
      icon: 'domains',
      iconBgColor: '#4f6bed'
    }
  ];

  // PFE chart data
  const myPfeData = [
    { label: 'En cours', value: pfeStats?.inProgress ?? 0, color: '#10b981' },
    { label: 'Terminés', value: pfeStats?.completed ?? 0, color: '#4f6bed' }
  ];

  const allPfeData = [
    { label: 'En cours', value: pfeStats?.inProgress ?? 0, color: '#10b981' },
    { label: 'Terminés', value: pfeStats?.completed ?? 0, color: '#4f6bed' }
  ];

  return (
    <Layout pageTitle="Dashboard" userName={userName} userEmail={userEmail} userInitials={userInitials}>
      <div className="dashboard">
        {/* Welcome Section */}
        <div className="dashboard__welcome">
          <h2 className="dashboard__greeting">
            Bienvenue, <span className="dashboard__name">{userName}</span>!
          </h2>
          <p className="dashboard__subtitle">
            Voici un aperçu de votre département aujourd'hui.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="dashboard__error" role="alert">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Réessayer</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className={`dashboard__stats ${loading ? 'dashboard__stats--loading' : ''}`}>
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

        {/* Charts Section */}
        <div className={`dashboard__charts ${loading ? 'dashboard__charts--loading' : ''}`}>
          <ProgressChart
            title="Mes PFE's - Avancement"
            linkText="Voir tous"
            linkHref="/mes-pfes"
            data={myPfeData}
          />
          <ProgressChart
            title="Tous les PFE's - Avancement"
            linkText="Voir tous"
            linkHref="/tous-les-pfes"
            data={allPfeData}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
