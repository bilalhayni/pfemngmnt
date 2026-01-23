import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Ban, Trash2, User } from 'lucide-react';
import { Layout } from '../../components/layout';
import { DataTable, PageHeader } from '../../components/common';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const ActivatedStudents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
            onClick={() => navigate(`/users/${row.id}`)}
          >
            <Eye size={16} />
          </button>
          <button
            className="table-action-btn table-action-btn--block"
            title="Bloquer le compte"
            onClick={() => handleBlock(row.id, row.name)}
            disabled={actionLoading === row.id}
          >
            <Ban size={16} />
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
          <User size={48} />
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
