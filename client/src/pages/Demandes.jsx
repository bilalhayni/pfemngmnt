import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader, StatCard } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { chefDepartementService } from '../services/api';
import './Demandes.css';

const Demandes = () => {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Chef';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'CH';

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

  if (loading) {
    return (
      <Layout pageTitle="Demandes" userName={userName} userInitials={userInitials}>
        <div className="loading-container">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Demandes" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Demandes"
        subtitle="Demandes d'affectation aux PFEs des étudiants"
      />

      <div className="stats-row">
        <StatCard title="En attente" value={demandes.length} subtitle="Demandes à traiter" icon="requests" iconBgColor="#f59e0b" />
      </div>

      {demandes.length === 0 ? (
        <div className="empty-state">
          <p>Aucune demande en attente.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={demandes}
          searchPlaceholder="Rechercher une demande..."
        />
      )}
    </Layout>
  );
};

export default Demandes;
