import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader, StatCard } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { chefDepartementService } from '../services/api';
import './TousLesPfes.css';

const TousLesPfes = () => {
  const { user } = useAuth();
  const [pfes, setPfes] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Chef';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'CH';

  useEffect(() => {
    const fetchAllPfes = async () => {
      if (!user?.idFiliere) return;

      setLoading(true);
      try {
        const response = await chefDepartementService.getAllPfes(user.idFiliere);
        if (response?.data) {
          const formattedData = response.data.map(pfe => ({
            id: pfe.id,
            title: pfe.titre || 'Sans titre',
            supervisor: pfe.fname || 'N/A',
            supervisorInitials: pfe.fname
              ? pfe.fname.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
              : 'NA',
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

    fetchAllPfes();
  }, [user]);

  // Calculate stats
  const totalPfes = pfes.length;
  const enCours = pfes.filter(p => p.status === 'En cours').length;
  const termines = pfes.filter(p => p.status === 'Terminé').length;
  const uniqueSupervisors = [...new Set(pfes.map(p => p.supervisor))].length;

  const columns = [
    { key: 'title', label: 'Titre du PFE' },
    {
      key: 'supervisor',
      label: 'Encadrant',
      render: (value, row) => (
        <div className="table-avatar">
          <div className="table-avatar__image" style={{ backgroundColor: '#22c55e' }}>{row.supervisorInitials}</div>
          <span className="table-avatar__name">{value}</span>
        </div>
      )
    },
    { key: 'nbStudents', label: 'Nb. Étudiants' },
    {
      key: 'status',
      label: 'Statut',
      render: (value) => {
        const statusClass = value === 'Terminé' ? 'completed' : value === 'En cours' ? 'in-progress' : 'pending';
        return <span className={`status-badge status-badge--${statusClass}`}>{value}</span>;
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="table-actions">
          <button className="table-action-btn table-action-btn--view" title="Voir détails">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <Layout pageTitle="Tous les PFE's" userName={userName} userInitials={userInitials}>
        <div className="loading-container">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Tous les PFE's" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Tous les PFE's"
        subtitle="Vue d'ensemble de tous les projets de fin d'études de la filière"
      />

      <div className="stats-row">
        <StatCard title="Total PFEs" value={totalPfes} subtitle="Tous projets" icon="folder" iconBgColor="#a65b43" />
        <StatCard title="En cours" value={enCours} subtitle="Projets actifs" icon="progress" iconBgColor="#10b981" />
        <StatCard title="Terminés" value={termines} subtitle="Projets complétés" icon="check" iconBgColor="#8b5cf6" />
        <StatCard title="Encadrants" value={uniqueSupervisors} subtitle="Professeurs actifs" icon="professors" iconBgColor="#f59e0b" />
      </div>

      {pfes.length === 0 ? (
        <div className="empty-state">
          <p>Aucun PFE trouvé dans votre filière.</p>
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

export default TousLesPfes;
