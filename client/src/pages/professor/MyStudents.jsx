import React, { useState, useEffect } from 'react';
import { Calendar, Users } from 'lucide-react';
import { Layout } from '../../components/layout';
import { DataTable, PageHeader } from '../../components/common';
import { professorPortalService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './ProfessorPages.css';

const MyStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Professeur';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'PR';

  const fetchStudents = async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await professorPortalService.getMyStudents(userId);
      if (response?.data) {
        const formattedData = response.data.map(student => ({
          id: student.id,
          studentName: student.fname,
          studentInitials: student.fname?.split(' ').map(n => n[0]).join('') || 'ET',
          titre: student.titre,
          avancement: student.avancement || 'En cours',
          date: student.date || '-',
          dateSoutenance: student.dateSoutenance || 'Non définie',
          idPfe: student.idPfe
        }));
        setStudents(formattedData);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleUpdateProgress = async (idPfe, newProgress) => {
    try {
      await professorPortalService.updatePfeProgress(idPfe, newProgress);
      await fetchStudents();
      alert('Avancement mis à jour!');
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleSetDefenseDate = async (idPfe) => {
    const date = prompt('Entrez la date de soutenance (YYYY-MM-DD):');
    if (!date) return;

    try {
      await professorPortalService.setDefenseDate(idPfe, date);
      await fetchStudents();
      alert('Date de soutenance définie!');
    } catch (error) {
      console.error('Error setting defense date:', error);
      alert('Erreur lors de la définition de la date');
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
      label: 'PFE',
      render: (value) => (
        <span style={{ fontWeight: 500 }}>{value}</span>
      )
    },
    {
      key: 'avancement',
      label: 'Avancement',
      render: (value, row) => (
        <select
          className={getProgressBadgeClass(value)}
          style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '20px' }}
          value={value}
          onChange={(e) => handleUpdateProgress(row.idPfe, e.target.value)}
        >
          <option value="En cours">En cours</option>
          <option value="En attente">En attente</option>
          <option value="Terminé">Terminé</option>
        </select>
      )
    },
    {
      key: 'date',
      label: 'Date d\'affectation'
    },
    {
      key: 'dateSoutenance',
      label: 'Soutenance',
      render: (value, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: value === 'Non définie' ? '#94a3b8' : '#1e293b' }}>{value}</span>
          <button
            onClick={() => handleSetDefenseDate(row.idPfe)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#a65b43',
              padding: '0.25rem'
            }}
            title="Définir la date"
          >
            <Calendar size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout pageTitle="Mes Étudiants" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Mes Étudiants"
        subtitle="Suivez l'avancement de vos étudiants encadrés"
      />
      {loading ? (
        <div className="professor-loading">Chargement...</div>
      ) : students.length === 0 ? (
        <div className="professor-empty">
          <Users size={48} />
          <p>Aucun étudiant encadré pour le moment</p>
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

export default MyStudents;
