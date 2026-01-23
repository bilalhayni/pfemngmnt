import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ClipboardList } from 'lucide-react';
import { Layout } from '../../components/layout';
import { DataTable, PageHeader } from '../../components/common';
import { professorPortalService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './ProfessorPages.css';

const StudentRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Professeur';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'PR';

  const fetchRequests = async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await professorPortalService.getStudentRequests(userId);
      if (response?.data) {
        const formattedData = response.data.map(req => ({
          id: req.id,
          studentName: `${req.firstName} ${req.lastName}`,
          studentInitials: `${req.firstName?.[0] || ''}${req.lastName?.[0] || ''}`,
          titre: req.titre,
          date: req.date || '-',
          idUser: req.idUser
        }));
        setRequests(formattedData);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id, studentName) => {
    if (!window.confirm(`Voulez-vous accepter la demande de ${studentName} ?`)) return;

    setActionLoading(id);
    try {
      await professorPortalService.acceptRequest(id);
      await fetchRequests();
      alert('Demande acceptée avec succès!');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Erreur lors de l\'acceptation de la demande');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, studentName) => {
    if (!window.confirm(`Voulez-vous rejeter la demande de ${studentName} ?`)) return;

    setActionLoading(id);
    try {
      await professorPortalService.rejectRequest(id);
      await fetchRequests();
      alert('Demande rejetée avec succès!');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Erreur lors du rejet de la demande');
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      key: 'studentName',
      label: 'Étudiant',
      render: (value, row) => (
        <div className="table-avatar">
          <div className="table-avatar__image">{row.studentInitials}</div>
          <div className="table-avatar__info">
            <span className="table-avatar__name">{value}</span>
          </div>
        </div>
      )
    },
    {
      key: 'titre',
      label: 'PFE demandé',
      render: (value) => (
        <span style={{ fontWeight: 500 }}>{value}</span>
      )
    },
    {
      key: 'date',
      label: 'Date de demande'
    },
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
            className="table-action-btn table-action-btn--accept"
            title="Accepter"
            onClick={() => handleAccept(row.id, row.studentName)}
            disabled={actionLoading === row.id}
          >
            <Check size={16} />
            {actionLoading === row.id ? '...' : 'Accepter'}
          </button>
          <button
            className="table-action-btn table-action-btn--reject"
            title="Rejeter"
            onClick={() => handleReject(row.id, row.studentName)}
            disabled={actionLoading === row.id}
          >
            <X size={16} />
            Rejeter
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout pageTitle="Demandes" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Demandes des Étudiants"
        subtitle="Gérez les demandes de PFE des étudiants"
      />
      {loading ? (
        <div className="professor-loading">Chargement...</div>
      ) : requests.length === 0 ? (
        <div className="professor-empty">
          <ClipboardList size={48} />
          <p>Aucune demande en attente</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={requests}
          searchPlaceholder="Rechercher une demande..."
        />
      )}
    </Layout>
  );
};

export default StudentRequests;
