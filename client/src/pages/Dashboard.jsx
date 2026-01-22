import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/common/StatCard';
import ProgressChart from '../components/common/ProgressChart';
import { useAuth } from '../context/AuthContext';
import { chefDepartementService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myPfeStats, setMyPfeStats] = useState([]);
  const [allPfeStats, setAllPfeStats] = useState([]);
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
      if (!user?.idFiliere) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch dashboard stats and PFE progress data in parallel
        const [statsResponse, myPfeResponse, allPfeResponse] = await Promise.all([
          chefDepartementService.getStats(user.idFiliere).catch(() => null),
          chefDepartementService.getMyPfeStats(user.id).catch(() => null),
          chefDepartementService.getAllPfeStats(user.idFiliere).catch(() => null)
        ]);

        // Process dashboard stats
        if (statsResponse?.data) {
          setStats(statsResponse.data);
        }

        // Process my PFE stats for charts
        if (myPfeResponse?.data) {
          setMyPfeStats(Array.isArray(myPfeResponse.data) ? myPfeResponse.data : []);
        }

        // Process all PFE stats for charts
        if (allPfeResponse?.data) {
          setAllPfeStats(Array.isArray(allPfeResponse.data) ? allPfeResponse.data : []);
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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
      value: stats?.pfesCount ?? 0,
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

  // Convert PFE stats to chart format
  const getChartData = (pfeStatsData) => {
    const colorMap = {
      'En cours': '#10b981',
      'Terminé': '#4f6bed',
      'En attente': '#f59e0b'
    };

    return pfeStatsData.map(stat => ({
      label: stat.avancement,
      value: stat.num,
      color: colorMap[stat.avancement] || '#94a3b8'
    }));
  };

  const myPfeData = getChartData(myPfeStats);
  const allPfeData = getChartData(allPfeStats);

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
            data={myPfeData.length > 0 ? myPfeData : [{ label: 'Aucun', value: 0, color: '#94a3b8' }]}
          />
          <ProgressChart
            title="Tous les PFE's - Avancement"
            linkText="Voir tous"
            linkHref="/tous-les-pfes"
            data={allPfeData.length > 0 ? allPfeData : [{ label: 'Aucun', value: 0, color: '#94a3b8' }]}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
