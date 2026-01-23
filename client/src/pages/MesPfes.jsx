import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader, StatCard } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { chefDepartementService } from '../services/api';
import './MesPfes.css';

const MesPfes = () => {
  const { user } = useAuth();
  const [pfes, setPfes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Chef';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'CH';

  const fetchPfes = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await chefDepartementService.getMyPfes(user.id);
      if (response?.data) {
        const formattedData = response.data.map(pfe => ({
          id: pfe.id,
          title: pfe.titre || 'Sans titre',
          domain: pfe.domaine || '',
          filiere: pfe.filiere || '',
          nbStudents: pfe.nbr_etd || 1,
          status: pfe.avancement || 'En cours',
          description: pfe.description || ''
        }));
        setPfes(formattedData);
      }
    } catch (error) {
      console.error('Error fetching PFEs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPfes();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce PFE ?')) return;

    setActionLoading(id);
    try {
      await chefDepartementService.deletePfe(id);
      fetchPfes();
    } catch (error) {
      console.error('Error deleting PFE:', error);
      alert('Erreur lors de la suppression du PFE');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateProgress = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await chefDepartementService.updatePfeProgress(id, newStatus);
      fetchPfes();
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setActionLoading(null);
    }
  };

  // Calculate stats
  const totalPfes = pfes.length;
  const enCours = pfes.filter(p => p.status === 'En cours').length;
  const termines = pfes.filter(p => p.status === 'Terminé').length;

  const columns = [
    { key: 'title', label: 'Titre du PFE' },
    { key: 'domain', label: 'Domaine' },
    { key: 'nbStudents', label: 'Nb. Étudiants' },
    {
      key: 'status',
      label: 'Statut',
      render: (value, row) => {
        const statusClass = value === 'Terminé' ? 'completed' : value === 'En cours' ? 'in-progress' : 'pending';
        return (
          <select
            className={`status-select status-select--${statusClass}`}
            value={value}
            onChange={(e) => handleUpdateProgress(row.id, e.target.value)}
            disabled={actionLoading === row.id}
          >
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="table-actions">
          <button
            className="table-action-btn table-action-btn--delete"
            title="Supprimer"
            onClick={() => handleDelete(row.id)}
            disabled={actionLoading === row.id}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <Layout pageTitle="Mes PFE's" userName={userName} userInitials={userInitials}>
        <div className="loading-container">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Mes PFE's" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Mes PFE's"
        subtitle="Projets de fin d'études que vous encadrez"
      />

      <div className="stats-row">
        <StatCard title="Total PFEs" value={totalPfes} subtitle="Projets encadrés" icon="folder" iconBgColor="#a65b43" />
        <StatCard title="En cours" value={enCours} subtitle="Projets actifs" icon="progress" iconBgColor="#10b981" />
        <StatCard title="Terminés" value={termines} subtitle="Projets complétés" icon="check" iconBgColor="#8b5cf6" />
      </div>

      {pfes.length === 0 ? (
        <div className="empty-state">
          <p>Vous n'avez pas encore de PFE. Créez-en un pour commencer.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={pfes}
          searchPlaceholder="Rechercher un PFE..."
        />
      )}
    </Layout>
  );
};

export default MesPfes;
