import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { DataTable, PageHeader } from '../../components/common';
import { studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './StudentPages.css';

const MyPfe = () => {
  const { user } = useAuth();
  const [pfe, setPfe] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Étudiant';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'ET';

  const fetchMyPfe = async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await studentService.getMyPfe(userId);
      if (response?.data) {
        const formattedData = response.data.map(p => ({
          id: p.id,
          titre: p.titre,
          professor: p.fname || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
          dateAssignment: p.date || '-',
          dateSoutenance: p.dateSoutenance || 'Non définie'
        }));
        setPfe(formattedData);
      }
    } catch (error) {
      console.error('Error fetching my PFE:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPfe();
  }, []);

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
      label: 'Encadrant'
    },
    {
      key: 'dateAssignment',
      label: 'Date d\'affectation'
    },
    {
      key: 'dateSoutenance',
      label: 'Date de soutenance',
      render: (value) => (
        <span className={value === 'Non définie' ? 'text-muted' : 'text-success'}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: () => (
        <span className="status-badge status-badge--assigned">
          Assigné
        </span>
      )
    }
  ];

  return (
    <Layout pageTitle="Mon PFE" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Mon Projet de Fin d'Études"
        subtitle="Consultez les informations de votre PFE assigné"
      />
      {loading ? (
        <div className="student-loading">Chargement...</div>
      ) : pfe.length === 0 ? (
        <div className="student-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <p>Vous n'avez pas encore de PFE assigné</p>
          <a href="/student/applications" style={{ marginTop: '1rem', color: '#a65b43', textDecoration: 'none' }}>
            Voir mes postulations en cours
          </a>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={pfe}
          searchPlaceholder="Rechercher..."
        />
      )}

      {pfe.length > 0 && (
        <div className="pfe-details" style={{ marginTop: '1.5rem' }}>
          <h3 className="pfe-details__section-title">Informations complémentaires</h3>
          <p className="pfe-details__description">
            Votre PFE est en cours. Contactez votre encadrant pour plus d'informations sur les étapes à suivre.
            La date de soutenance sera fixée par votre département une fois le travail terminé.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default MyPfe;
