import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { DataTable, PageHeader } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { chefDepartementService } from '../services/api';
import './Etudiants.css';

const Etudiants = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Chef';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'CH';

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.idFiliere) return;

      setLoading(true);
      try {
        const response = await chefDepartementService.getStudents(user.idFiliere);
        if (response?.data) {
          const formattedData = response.data.map(student => ({
            id: student.id,
            name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'N/A',
            initials: `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase() || 'NA',
            email: student.email || '',
            filiere: student.filiere || '',
            phone: student.phone || '',
            status: student.valid === 1 ? 'Actif' : 'Inactif'
          }));
          setStudents(formattedData);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  const columns = [
    {
      key: 'name',
      label: 'Étudiant',
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
    { key: 'filiere', label: 'Filière' },
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
      <Layout pageTitle="Étudiants" userName={userName} userInitials={userInitials}>
        <div className="loading-container">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Étudiants" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Étudiants"
        subtitle="Liste des étudiants actifs de votre filière"
      />
      {students.length === 0 ? (
        <div className="empty-state">
          <p>Aucun étudiant actif trouvé dans votre filière.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={students}
          searchPlaceholder="Rechercher un étudiant..."
        />
      )}
    </Layout>
  );
};

export default Etudiants;
