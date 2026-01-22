import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { chefDepartementService } from '../services/api';
import './PfesEtudiants.css';

const PfesEtudiants = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Chef';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'CH';

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const response = await chefDepartementService.getAssignedStudents(user.id);
        if (response?.data) {
          const formattedData = response.data.map(item => ({
            id: item.id,
            student: item.fname || 'N/A',
            studentInitials: item.fname
              ? item.fname.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
              : 'NA',
            pfeTitle: item.titre || 'Sans titre',
            pfeId: item.idPfe,
            date: item.date || '',
            status: item.avancement || 'En cours',
            defenseDate: item.dateSoutenance || null,
            nbStudents: item.nbr_etd || 1
          }));
          setAssignments(formattedData);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  const columns = [
    {
      key: 'student',
      label: 'Étudiant',
      render: (value, row) => (
        <div className="table-avatar">
          <div className="table-avatar__image">{row.studentInitials}</div>
          <span className="table-avatar__name">{value}</span>
        </div>
      )
    },
    { key: 'pfeTitle', label: 'Titre du PFE' },
    { key: 'date', label: 'Date d\'affectation' },
    {
      key: 'status',
      label: 'Avancement',
      render: (value) => {
        const statusClass = value === 'Terminé' ? 'completed' : value === 'En cours' ? 'in-progress' : 'pending';
        return <span className={`status-badge status-badge--${statusClass}`}>{value}</span>;
      }
    },
    {
      key: 'defenseDate',
      label: 'Soutenance',
      render: (value) => value || <span className="text-muted">Non planifiée</span>
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
      <Layout pageTitle="PFE's et Étudiants" userName={userName} userInitials={userInitials}>
        <div className="loading-container">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="PFE's et Étudiants" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="PFE's et Étudiants"
        subtitle="Étudiants affectés à vos projets de fin d'études"
      />
      {assignments.length === 0 ? (
        <div className="empty-state">
          <p>Aucun étudiant n'est encore affecté à vos PFEs.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={assignments}
          searchPlaceholder="Rechercher par étudiant ou PFE..."
        />
      )}
    </Layout>
  );
};

export default PfesEtudiants;
