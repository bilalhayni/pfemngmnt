import React from 'react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader, StatCard } from '../components/common';
import './MesPfes.css';

const MesPfes = () => {
  const stats = [
    { title: 'Total PFEs', value: '5', icon: 'folder', color: 'blue' },
    { title: 'En cours', value: '3', icon: 'progress', color: 'green' },
    { title: 'Terminés', value: '2', icon: 'check', color: 'purple' }
  ];

  const columns = [
    { key: 'title', label: 'Titre du PFE' },
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
    { key: 'domain', label: 'Domaine' },
    { key: 'startDate', label: 'Date début' },
    {
      key: 'progress',
      label: 'Avancement',
      render: (value) => (
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${value}%` }}></div>
          </div>
          <span className="progress-bar__text">{value}%</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value) => {
        const statusClass = value === 'Terminé' ? 'completed' : value === 'En cours' ? 'in-progress' : 'pending';
        return <span className={`status-badge status-badge--${statusClass}`}>{value}</span>;
      }
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
          <button className="table-action-btn table-action-btn--edit" title="Modifier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  const data = [
    { id: 1, title: 'Système de gestion des PFE', student: 'Hamza El Amrani', studentInitials: 'HE', domain: 'Développement Web', startDate: '15/09/2024', progress: 75, status: 'En cours' },
    { id: 2, title: 'Application mobile de santé', student: 'Sara Bennani', studentInitials: 'SB', domain: 'Mobile', startDate: '01/10/2024', progress: 45, status: 'En cours' },
    { id: 3, title: 'Plateforme e-learning IA', student: 'Omar Idrissi', studentInitials: 'OI', domain: 'IA', startDate: '20/09/2024', progress: 100, status: 'Terminé' },
    { id: 4, title: 'Chatbot intelligent', student: 'Nadia Chraibi', studentInitials: 'NC', domain: 'NLP', startDate: '05/10/2024', progress: 30, status: 'En cours' },
    { id: 5, title: 'Système de recommandation', student: 'Yassine Berrada', studentInitials: 'YB', domain: 'Machine Learning', startDate: '01/09/2024', progress: 100, status: 'Terminé' }
  ];

  const AddButton = (
    <button className="btn btn--primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Nouveau PFE
    </button>
  );

  return (
    <Layout pageTitle="Mes PFE's" userName="Chef" userInitials="CH">
      <PageHeader
        title="Mes PFE's"
        subtitle="Gérez les projets de fin d'études que vous encadrez"
        action={AddButton}
      />

      <div className="stats-row">
        <StatCard title="Total PFEs" value="5" subtitle="Projets encadrés" color="blue" icon="folder" />
        <StatCard title="En cours" value="3" subtitle="Projets actifs" color="green" icon="progress" />
        <StatCard title="Terminés" value="2" subtitle="Projets complétés" color="purple" icon="check" />
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Rechercher un PFE..."
      />
    </Layout>
  );
};

export default MesPfes;
