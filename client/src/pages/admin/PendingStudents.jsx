import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { DataTable, PageHeader } from '../../components/common';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const PendingStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'AD';

  const fetchStudents = async () => {
    try {
      const response = await adminService.getPendingStudents();
      if (response?.data) {
        const formattedData = response.data.map(student => ({
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          initials: `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`,
          email: student.email,
          phone: student.phone || '-',
          filiere: student.filiere || '-',
          createdAt: student.createdAt || '-'
        }));
        setStudents(formattedData);
      }
    } catch (error) {
      console.error('Error fetching pending students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleActivate = async (id, name) => {
    if (!window.confirm(`Voulez-vous activer le compte de ${name} ?`)) return;

    setActionLoading(id);
    try {
      await adminService.activateStudent(id);
      await fetchStudents();
      alert('Compte activé avec succès!');
    } catch (error) {
      console.error('Error activating student:', error);
      alert('Erreur lors de l\'activation du compte');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Voulez-vous rejeter la demande de ${name} ? Cette action est irréversible.`)) return;

    setActionLoading(id);
    try {
      await adminService.deleteUser(id);
      await fetchStudents();
      alert('Demande rejetée avec succès!');
    } catch (error) {
      console.error('Error rejecting student:', error);
      alert('Erreur lors du rejet de la demande');
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
        <span className="status-badge status-badge--pending">
          En attente
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
            className="table-action-btn table-action-btn--activate"
            title="Activer le compte"
            onClick={() => handleActivate(row.id, row.name)}
            disabled={actionLoading === row.id}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {actionLoading === row.id ? '...' : 'Activer'}
          </button>
          <button
            className="table-action-btn table-action-btn--reject"
            title="Rejeter la demande"
            onClick={() => handleReject(row.id, row.name)}
            disabled={actionLoading === row.id}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Rejeter
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout pageTitle="Demandes d'activation" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Demandes d'activation"
        subtitle="Gérez les demandes d'activation des comptes étudiants"
      />
      {loading ? (
        <div className="admin-loading">Chargement...</div>
      ) : students.length === 0 ? (
        <div className="admin-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 15h8" />
            <circle cx="9" cy="9" r="1" fill="currentColor" />
            <circle cx="15" cy="9" r="1" fill="currentColor" />
          </svg>
          <p>Aucune demande d'activation en attente</p>
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

export default PendingStudents;
