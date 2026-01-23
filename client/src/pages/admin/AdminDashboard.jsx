import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import StatCard from '../../components/common/StatCard';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/api';
import './AdminDashboard.css';
import '../Dashboard.css';
import ProgressChart from '../../components/common/ProgressChart';
import { chefDepartementService } from '../../services/api';
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
  const [myPfeStats, setMyPfeStats] = useState([]);
  const [allPfeStats, setAllPfeStats] = useState([]);
  const [error, setError] = useState(null);

  // User info from auth context or fallback


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
      iconBgColor: '#a65b43'
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
      iconBgColor: '#a65b43'
    }
  ];

  // Convert PFE stats to chart format
  const getChartData = (pfeStatsData) => {
    const colorMap = {
      'En cours': '#10b981',
      'Terminé': '#a65b43',
      'En attente': '#f59e0b'
    };

    return pfeStatsData.map(stat => ({
      label: stat.avancement,
      value: stat.num,
      color: colorMap[stat.avancement] || '#94a3b8'
    }));
  };
  

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

 
  const [demandes, setDemandes] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

 

  const fetchDemandes = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await chefDepartementService.getStudentRequests(user.id);
      if (response?.data) {
        const formattedData = response.data.map(demande => ({
          id: demande.id,
          student: `${demande.firstName || ''} ${demande.lastName || ''}`.trim() || 'N/A',
          studentInitials: `${demande.firstName?.[0] || ''}${demande.lastName?.[0] || ''}`.toUpperCase() || 'NA',
          studentId: demande.idUser,
          pfeTitle: demande.titre || 'Sans titre',
          date: demande.date || '',
          status: 'En attente'
        }));
        setDemandes(formattedData);
      }
    } catch (error) {
      console.error('Error fetching demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, [user]);

  const handleAccept = async (id) => {
    setActionLoading(id);
    try {
      await chefDepartementService.acceptRequest(id);
      fetchDemandes();
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Erreur lors de l\'acceptation de la demande');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir rejeter cette demande ?')) return;

    setActionLoading(id);
    try {
      await chefDepartementService.rejectRequest(id);
      fetchDemandes();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Erreur lors du rejet de la demande');
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    { key: 'id', label: '#' },
    {
      key: 'student',
      label: 'Demandeur',
      render: (value, row) => (
        <div className="table-avatar">
          <div className="table-avatar__image">{row.studentInitials}</div>
          <span className="table-avatar__name">{value}</span>
        </div>
      )
    },
    { key: 'pfeTitle', label: 'PFE demandé' },
    { key: 'date', label: 'Date' },
    {
      key: 'status',
      label: 'Statut',
      render: (value) => (
        <span className="status-badge status-badge--pending">{value}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="table-actions">
          <button
            className="table-action-btn table-action-btn--approve"
            title="Accepter"
            onClick={() => handleAccept(row.id)}
            disabled={actionLoading === row.id}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          <button
            className="table-action-btn table-action-btn--reject"
            title="Rejeter"
            onClick={() => handleReject(row.id)}
            disabled={actionLoading === row.id}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )
    }
  ];
  const myPfeData = getChartData(myPfeStats);
  const allPfeData = getChartData(allPfeStats);

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
              <div className="admin-action-card__icon" style={{ backgroundColor: '#a65b43' }}>
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

export default AdminDashboard;
