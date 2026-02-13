import React, { useState, useEffect } from 'react';
import { Check, X, UserPlus, Users, FolderPlus } from 'lucide-react';
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
            <Check size={16} />
          </button>
          <button
            className="table-action-btn table-action-btn--reject"
            title="Rejeter"
            onClick={() => handleReject(row.id)}
            disabled={actionLoading === row.id}
          >
            <X size={16} />
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
                <UserPlus size={24} />
              </div>
              <span>Activer les comptes</span>
            </a>
            <a href="/admin/create-account" className="admin-action-card">
              <div className="admin-action-card__icon" style={{ backgroundColor: '#a65b43' }}>
                <UserPlus size={24} />
              </div>
              <span>Créer un compte</span>
            </a>
            <a href="/admin/professors" className="admin-action-card">
              <div className="admin-action-card__icon" style={{ backgroundColor: '#10b981' }}>
                <Users size={24} />
              </div>
              <span>Gérer les professeurs</span>
            </a>
            <a href="/admin/create-filiere" className="admin-action-card">
              <div className="admin-action-card__icon" style={{ backgroundColor: '#f59e0b' }}>
                <FolderPlus size={24} />
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
