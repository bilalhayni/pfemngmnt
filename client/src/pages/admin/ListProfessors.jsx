import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Plus, User } from 'lucide-react';
import { Layout } from '../../components/layout';
import { DataTable, PageHeader } from '../../components/common';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const ListProfessors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'AD';

  const fetchProfessors = async () => {
    try {
      const response = await adminService.getAllProfessors();
      if (response?.data) {
        const formattedData = response.data.map(prof => ({
          id: prof.id,
          name: `${prof.firstName || ''} ${prof.lastName || ''}`.trim() || prof.email,
          initials: `${prof.firstName?.[0] || ''}${prof.lastName?.[0] || ''}` || 'P',
          email: prof.email,
          phone: prof.phone || '-',
          filiere: prof.filiere || '-'
        }));
        setProfessors(formattedData);
      }
    } catch (error) {
      console.error('Error fetching professors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Voulez-vous supprimer définitivement le compte de ${name} ? Cette action est irréversible.`)) return;

    setActionLoading(id);
    try {
      await adminService.deleteUser(id);
      await fetchProfessors();
      alert('Compte supprimé avec succès!');
    } catch (error) {
      console.error('Error deleting professor:', error);
      alert('Erreur lors de la suppression du compte');
    } finally {
      setActionLoading(null);
    }
  };

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
    { key: 'phone', label: 'Téléphone' },
    { key: 'filiere', label: 'Filière' },
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
            onClick={() => navigate(`/users/${row.id}`)}
          >
            <Eye size={16} />
          </button>
          <button
            className="table-action-btn table-action-btn--delete"
            title="Supprimer le compte"
            onClick={() => handleDelete(row.id, row.name)}
            disabled={actionLoading === row.id}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const AddButton = (
    <a href="/admin/create-account" className="btn btn--primary">
      <Plus size={16} />
      Ajouter un professeur
    </a>
  );

  return (
    <Layout pageTitle="Professeurs" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Professeurs"
        subtitle="Liste de tous les professeurs du système"
        action={AddButton}
      />
      {loading ? (
        <div className="admin-loading">Chargement...</div>
      ) : professors.length === 0 ? (
        <div className="admin-empty">
          <User size={48} />
          <p>Aucun professeur enregistré</p>
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

export default ListProfessors;
