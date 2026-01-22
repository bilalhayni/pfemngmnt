import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { DataTable, PageHeader } from '../../components/common';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const ActivatedStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'AD';

  const fetchStudents = async () => {
    try {
      const response = await adminService.getActivatedStudents();
      if (response?.data) {
        const formattedData = response.data.map(student => ({
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          initials: `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`,
          email: student.email,
          phone: student.phone || '-',
          filiere: student.filiere || '-'
        }));
        setStudents(formattedData);
      }
    } catch (error) {
      console.error('Error fetching activated students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleBlock = async (id, name) => {
    if (!window.confirm(`Voulez-vous bloquer le compte de ${name} ?`)) return;

    setActionLoading(id);
    try {
      await adminService.blockStudent(id);
      await fetchStudents();
      alert('Compte bloqué avec succès!');
    } catch (error) {
      console.error('Error blocking student:', error);
      alert('Erreur lors du blocage du compte');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Voulez-vous supprimer définitivement le compte de ${name} ? Cette action est irréversible.`)) return;

    setActionLoading(id);
    try {
      await adminService.deleteUser(id);
      await fetchStudents();
      alert('Compte supprimé avec succès!');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Erreur lors de la suppression du compte');
    } finally {
      setActionLoading(null);
    }
  };

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
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button
            className="table-action-btn table-action-btn--block"
            title="Bloquer le compte"
            onClick={() => handleBlock(row.id, row.name)}
            disabled={actionLoading === row.id}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
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

  return (
    <Layout pageTitle="Étudiants actifs" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Étudiants actifs"
        subtitle="Gérez les comptes étudiants activés"
      />
      {loading ? (
        <div className="admin-loading">Chargement...</div>
      ) : students.length === 0 ? (
        <div className="admin-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          <p>Aucun étudiant actif</p>
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

export default ActivatedStudents;
