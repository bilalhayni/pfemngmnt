import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Eye, Monitor } from 'lucide-react';
import { Layout } from '../../components/layout';
import { DataTable, PageHeader } from '../../components/common';
import { studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './StudentPages.css';

const ListAllPfe = () => {
  const { user } = useAuth();
  const [pfes, setPfes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Étudiant';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'ET';

  const fetchPfes = async () => {
    try {
      const filId = Cookies.get('filId');
      const response = await studentService.getAllPfes(filId);
      if (response?.data) {
        const formattedData = response.data.map(pfe => ({
          id: pfe.id,
          titre: pfe.titre,
          professor: pfe.fname || `${pfe.firstName || ''} ${pfe.lastName || ''}`.trim(),
          domaine: pfe.domaine || '-',
          nbr_etd: pfe.nbr_etd || 1,
          idProf: pfe.idProf
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

  const handleApply = async (id, titre, idProf) => {
    if (!window.confirm(`Voulez-vous postuler au PFE "${titre}" ?`)) return;

    const userId = Cookies.get('userId');
    setActionLoading(id);

    try {
      await studentService.applyToPfe({
        id_pfe: id,
        id_user: userId,
        id_prof: idProf
      });
      alert('Postulation envoyée avec succès!');
    } catch (error) {
      console.error('Error applying to PFE:', error);
      alert(error.response?.data?.message || 'Erreur lors de la postulation');
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
      key: 'domaine',
      label: 'Domaine'
    },
    {
      key: 'nbr_etd',
      label: 'Places',
      render: (value) => (
        <span className="pfe-places">{value} étudiant(s)</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="table-actions">
          <button
            className="table-action-btn table-action-btn--apply"
            title="Postuler"
            onClick={() => handleApply(row.id, row.titre, row.idProf)}
            disabled={actionLoading === row.id}
          >
            <Send size={16} />
            {actionLoading === row.id ? '...' : 'Postuler'}
          </button>
          <Link to={`/student/pfe/${row.id}`} className="table-action-btn table-action-btn--view">
            <Eye size={16} />
            Détails
          </Link>
        </div>
      )
    }
  ];

  return (
    <Layout pageTitle="Tous les PFEs" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Projets de Fin d'Études"
        subtitle="Parcourez les PFEs disponibles et postulez à ceux qui vous intéressent"
      />
      {loading ? (
        <div className="student-loading">Chargement...</div>
      ) : pfes.length === 0 ? (
        <div className="student-empty">
          <Monitor size={48} />
          <p>Aucun PFE disponible pour le moment</p>
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

export default ListAllPfe;
