import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, Folder } from 'lucide-react';
import { Layout } from '../../components/layout';
import { DataTable, PageHeader } from '../../components/common';
import { professorPortalService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './ProfessorPages.css';

const MyPfes = () => {
  const { user } = useAuth();
  const [pfes, setPfes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Professeur';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'PR';

  const fetchPfes = async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await professorPortalService.getMyPfes(userId);
      if (response?.data) {
        const formattedData = response.data.map(pfe => ({
          id: pfe.id,
          titre: pfe.titre,
          domaine: pfe.domaine || '-',
          nbr_etd: pfe.nbr_etd || 1,
          avancement: pfe.avancement || 'En cours',
          filiere: pfe.filiere || '-'
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
  }, []);

  const handleDelete = async (id, titre) => {
    if (!window.confirm(`Voulez-vous supprimer le PFE "${titre}" ?`)) return;

    setActionLoading(id);
    try {
      await professorPortalService.deletePfe(id);
      await fetchPfes();
      alert('PFE supprimé avec succès!');
    } catch (error) {
      console.error('Error deleting PFE:', error);
      alert('Erreur lors de la suppression du PFE');
    } finally {
      setActionLoading(null);
    }
  };

  const getProgressBadgeClass = (avancement) => {
    switch (avancement?.toLowerCase()) {
      case 'terminé':
        return 'progress-badge progress-badge--termine';
      case 'en attente':
        return 'progress-badge progress-badge--en-attente';
      default:
        return 'progress-badge progress-badge--en-cours';
    }
  };

  const columns = [
    {
      key: 'titre',
      label: 'Titre du PFE',
      render: (value) => (
        <span style={{ fontWeight: 500, color: '#1e293b' }}>{value}</span>
      )
    },
    {
      key: 'domaine',
      label: 'Domaine'
    },
    {
      key: 'nbr_etd',
      label: 'Places',
      render: (value) => `${value} étudiant(s)`
    },
    {
      key: 'avancement',
      label: 'Avancement',
      render: (value) => (
        <span className={getProgressBadgeClass(value)}>
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
          <Link to={`/prof/pfe/edit/${row.id}`} className="table-action-btn table-action-btn--edit" title="Modifier">
            <Pencil size={16} />
          </Link>
          <button
            className="table-action-btn table-action-btn--delete"
            title="Supprimer"
            onClick={() => handleDelete(row.id, row.titre)}
            disabled={actionLoading === row.id}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const AddButton = (
    <Link to="/prof/pfe/new" className="btn btn--primary">
      <Plus size={16} />
      Créer un PFE
    </Link>
  );

  return (
    <Layout pageTitle="Mes PFEs" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Mes Projets de Fin d'Études"
        subtitle="Gérez vos PFEs et suivez leur avancement"
        action={AddButton}
      />
      {loading ? (
        <div className="professor-loading">Chargement...</div>
      ) : pfes.length === 0 ? (
        <div className="professor-empty">
          <Folder size={48} />
          <p>Vous n'avez pas encore créé de PFE</p>
          <Link to="/prof/pfe/new" style={{ marginTop: '1rem', color: '#a65b43', textDecoration: 'none' }}>
            Créer votre premier PFE
          </Link>
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

export default MyPfes;
