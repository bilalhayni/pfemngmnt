import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { DataTable, PageHeader } from '../../components/common';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const ListChefDepartement = () => {
  const { user } = useAuth();
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'AD';

  const fetchChefs = async () => {
    try {
      const response = await adminService.getAllChefDepartements();
      if (response?.data) {
        const formattedData = response.data.map(chef => ({
          id: chef.id,
          name: `${chef.firstName || ''} ${chef.lastName || ''}`.trim() || chef.email,
          initials: `${chef.firstName?.[0] || ''}${chef.lastName?.[0] || ''}` || 'CD',
          email: chef.email,
          phone: chef.phone || '-',
          filiere: chef.filiere || '-'
        }));
        setChefs(formattedData);
      }
    } catch (error) {
      console.error('Error fetching chefs de département:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Voulez-vous supprimer définitivement le compte de ${name} ? Cette action est irréversible.`)) return;

    setActionLoading(id);
    try {
      await adminService.deleteUser(id);
      await fetchChefs();
      alert('Compte supprimé avec succès!');
    } catch (error) {
      console.error('Error deleting chef:', error);
      alert('Erreur lors de la suppression du compte');
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Chef de Département',
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
    { key: 'phone', label: 'Téléphone' },
    { key: 'filiere', label: 'Département' },
    {
      key: 'status',
      label: 'Statut',
      render: () => (
        <span className="status-badge status-badge--active">
          Actif
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
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button
            className="table-action-btn table-action-btn--delete"
            title="Supprimer le compte"
            onClick={() => handleDelete(row.id, row.name)}
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

  const AddButton = (
    <a href="/admin/create-account" className="btn btn--primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Ajouter un chef de département
    </a>
  );

  return (
    <Layout pageTitle="Chefs de Département" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Chefs de Département"
        subtitle="Liste de tous les chefs de département du système"
        action={AddButton}
      />
      {loading ? (
        <div className="admin-loading">Chargement...</div>
      ) : chefs.length === 0 ? (
        <div className="admin-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          <p>Aucun chef de département enregistré</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={chefs}
          searchPlaceholder="Rechercher un chef de département..."
        />
      )}
    </Layout>
  );
};

export default ListChefDepartement;
