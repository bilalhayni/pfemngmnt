import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { DataTable, PageHeader } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { chefDepartementService } from '../services/api';
import './Professeurs.css';

const Professeurs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Chef';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'CH';

  useEffect(() => {
    const fetchProfessors = async () => {
      if (!user?.idFiliere) return;

      setLoading(true);
      try {
        const response = await chefDepartementService.getProfessors(user.idFiliere);
        if (response?.data) {
          const formattedData = response.data.map(prof => ({
            id: prof.id,
            name: `${prof.firstName || ''} ${prof.lastName || ''}`.trim() || 'N/A',
            initials: `${prof.firstName?.[0] || ''}${prof.lastName?.[0] || ''}`.toUpperCase() || 'NA',
            email: prof.email || '',
            department: prof.filiere || '',
            phone: prof.phone || '',
            status: prof.valid === 1 ? 'Actif' : 'Inactif'
          }));
          setProfessors(formattedData);
        }
      } catch (error) {
        console.error('Error fetching professors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, [user]);

  const columns = [
    {
      key: 'name',
      label: 'Professeur',
      render: (value, row) => (
        <div className="table-avatar">
          <div className="table-avatar__image">{row.initials}</div>
          <div className="table-avatar__info">
            <span className="table-avatar__name">{value}</span>
            <span className="table-avatar__email">{row.email}</span>
          </div>
        </div>
      )
    },
    { key: 'department', label: 'Filière' },
    { key: 'phone', label: 'Téléphone' },
    {
      key: 'status',
      label: 'Statut',
      render: (value) => (
        <span className={`status-badge status-badge--${value === 'Actif' ? 'active' : 'inactive'}`}>
          {value}
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
            className="table-action-btn table-action-btn--view"
            title="Voir le profil"
            onClick={() => navigate(`/users/${row.id}`)}
          >
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
      <Layout pageTitle="Professeurs" userName={userName} userInitials={userInitials}>
        <div className="loading-container">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Professeurs" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Professeurs"
        subtitle="Liste des professeurs de votre filière"
      />
      {professors.length === 0 ? (
        <div className="empty-state">
          <p>Aucun professeur trouvé dans votre filière.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={professors}
          searchPlaceholder="Rechercher un professeur..."
        />
      )}
    </Layout>
  );
};

export default Professeurs;
