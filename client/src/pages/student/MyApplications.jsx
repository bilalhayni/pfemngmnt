import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { DataTable, PageHeader } from '../../components/common';
import { studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './StudentPages.css';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Étudiant';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'ET';

  const fetchApplications = async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await studentService.getMyApplications(userId);
      if (response?.data) {
        const formattedData = response.data.map(app => ({
          id: app.id,
          titre: app.titre,
          professor: app.fname || `${app.firstName || ''} ${app.lastName || ''}`.trim(),
          date: app.date || '-'
        }));
        setApplications(formattedData);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCancel = async (id, titre) => {
    if (!window.confirm(`Voulez-vous annuler votre postulation au PFE "${titre}" ?`)) return;

    setActionLoading(id);
    try {
      await studentService.cancelApplication(id);
      await fetchApplications();
      alert('Postulation annulée avec succès!');
    } catch (error) {
      console.error('Error cancelling application:', error);
      alert('Erreur lors de l\'annulation de la postulation');
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      key: 'titre',
      label: 'Titre du PFE',
      render: (value) => (
        <span className="pfe-title">{value}</span>
      )
    },
    {
      key: 'professor',
      label: 'Professeur'
    },
    {
      key: 'date',
      label: 'Date de postulation'
    },
    {
      key: 'status',
      label: 'Statut',
      render: () => (
        <span className="status-badge status-badge--waiting">
          En attente
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="table-actions">
          <button
            className="table-action-btn table-action-btn--cancel"
            title="Annuler la postulation"
            onClick={() => handleCancel(row.id, row.titre)}
            disabled={actionLoading === row.id}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            {actionLoading === row.id ? '...' : 'Annuler'}
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout pageTitle="Mes postulations" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Mes Postulations"
        subtitle="Suivez l'état de vos demandes de PFE"
      />
      {loading ? (
        <div className="student-loading">Chargement...</div>
      ) : applications.length === 0 ? (
        <div className="student-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="15" x2="12" y2="15" />
          </svg>
          <p>Vous n'avez pas encore postulé à un PFE</p>
          <a href="/student/pfe" style={{ marginTop: '1rem', color: '#4f6bed', textDecoration: 'none' }}>
            Parcourir les PFEs disponibles
          </a>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={applications}
          searchPlaceholder="Rechercher une postulation..."
        />
      )}
    </Layout>
  );
};

export default MyApplications;
