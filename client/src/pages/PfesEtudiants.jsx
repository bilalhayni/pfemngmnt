import React from 'react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader } from '../components/common';
import './PfesEtudiants.css';

const PfesEtudiants = () => {
  const columns = [
    {
      key: 'student',
      label: 'Étudiant',
      render: (value, row) => (
        <div className="table-avatar">
          <div className="table-avatar__image">{row.studentInitials}</div>
          <div className="table-avatar__info">
            <span className="table-avatar__name">{value}</span>
            <span className="table-avatar__email">{row.email}</span>
          </div>
        </div>
      )
    },
    { key: 'cne', label: 'CNE' },
    { key: 'filiere', label: 'Filière' },
    { key: 'pfeTitle', label: 'Titre du PFE' },
    {
      key: 'supervisor',
      label: 'Encadrant',
      render: (value) => value || <span className="text-muted">Non assigné</span>
    },
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
        const statusClass = value === 'Soutenu' ? 'completed' : value === 'En cours' ? 'in-progress' : 'pending';
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
          <button className="table-action-btn table-action-btn--edit" title="Assigner PFE">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  const data = [
    { id: 1, student: 'Hamza El Amrani', studentInitials: 'HE', email: 'h.elamrani@etu.univ.ma', cne: 'R130456789', filiere: 'Génie Informatique', pfeTitle: 'Système de gestion des PFE', supervisor: 'Dr. Ahmed Benali', progress: 75, status: 'En cours' },
    { id: 2, student: 'Sara Bennani', studentInitials: 'SB', email: 's.bennani@etu.univ.ma', cne: 'R130567890', filiere: 'Génie Informatique', pfeTitle: 'Application mobile de santé', supervisor: 'Dr. Fatima Zahra', progress: 45, status: 'En cours' },
    { id: 3, student: 'Omar Idrissi', studentInitials: 'OI', email: 'o.idrissi@etu.univ.ma', cne: 'R130678901', filiere: 'Data Science', pfeTitle: 'Plateforme e-learning IA', supervisor: 'Dr. Mohamed Tazi', progress: 100, status: 'Soutenu' },
    { id: 4, student: 'Nadia Chraibi', studentInitials: 'NC', email: 'n.chraibi@etu.univ.ma', cne: 'R130789012', filiere: 'Réseaux', pfeTitle: 'Chatbot intelligent', supervisor: 'Dr. Ahmed Benali', progress: 30, status: 'En cours' },
    { id: 5, student: 'Yassine Berrada', studentInitials: 'YB', email: 'y.berrada@etu.univ.ma', cne: 'R130890123', filiere: 'Génie Informatique', pfeTitle: 'Système de recommandation', supervisor: 'Dr. Mohamed Tazi', progress: 100, status: 'Soutenu' },
    { id: 6, student: 'Laila Fassi', studentInitials: 'LF', email: 'l.fassi@etu.univ.ma', cne: 'R130901234', filiere: 'IA', pfeTitle: 'Analyse de sentiments', supervisor: 'Dr. Khadija Alami', progress: 60, status: 'En cours' },
    { id: 7, student: 'Rachid Amrani', studentInitials: 'RA', email: 'r.amrani@etu.univ.ma', cne: 'R131012345', filiere: 'IoT', pfeTitle: 'Application IoT Smart Home', supervisor: 'Dr. Youssef Mansouri', progress: 20, status: 'En cours' },
    { id: 8, student: 'Salma Kettani', studentInitials: 'SK', email: 's.kettani@etu.univ.ma', cne: 'R131123456', filiere: 'Data Science', pfeTitle: 'Détection de fraude bancaire', supervisor: 'Dr. Mohamed Tazi', progress: 85, status: 'En cours' }
  ];

  const ExportButton = (
    <button className="btn btn--outline">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Exporter
    </button>
  );

  return (
    <Layout pageTitle="PFE's et Étudiants" userName="Chef" userInitials="CH">
      <PageHeader
        title="PFE's et Étudiants"
        subtitle="Relation entre les étudiants et leurs projets de fin d'études"
        action={ExportButton}
      />
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Rechercher par étudiant ou PFE..."
      />
    </Layout>
  );
};

export default PfesEtudiants;
