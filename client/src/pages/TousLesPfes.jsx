import React from 'react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader, StatCard } from '../components/common';
import './TousLesPfes.css';

const TousLesPfes = () => {
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
    {
      key: 'supervisor',
      label: 'Encadrant',
      render: (value, row) => (
        <div className="table-avatar">
          <div className="table-avatar__image" style={{ backgroundColor: '#22c55e' }}>{row.supervisorInitials}</div>
          <span className="table-avatar__name">{value}</span>
        </div>
      )
    },
    { key: 'domain', label: 'Domaine' },
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
        </div>
      )
    }
  ];

  const data = [
    { id: 1, title: 'Système de gestion des PFE', student: 'Hamza El Amrani', studentInitials: 'HE', supervisor: 'Dr. Ahmed Benali', supervisorInitials: 'AB', domain: 'Développement Web', progress: 75, status: 'En cours' },
    { id: 2, title: 'Application mobile de santé', student: 'Sara Bennani', studentInitials: 'SB', supervisor: 'Dr. Fatima Zahra', supervisorInitials: 'FZ', domain: 'Mobile', progress: 45, status: 'En cours' },
    { id: 3, title: 'Plateforme e-learning IA', student: 'Omar Idrissi', studentInitials: 'OI', supervisor: 'Dr. Mohamed Tazi', supervisorInitials: 'MT', domain: 'IA', progress: 100, status: 'Terminé' },
    { id: 4, title: 'Chatbot intelligent', student: 'Nadia Chraibi', studentInitials: 'NC', supervisor: 'Dr. Ahmed Benali', supervisorInitials: 'AB', domain: 'NLP', progress: 30, status: 'En cours' },
    { id: 5, title: 'Système de recommandation', student: 'Yassine Berrada', studentInitials: 'YB', supervisor: 'Dr. Mohamed Tazi', supervisorInitials: 'MT', domain: 'Machine Learning', progress: 100, status: 'Terminé' },
    { id: 6, title: 'Analyse de sentiments', student: 'Laila Fassi', studentInitials: 'LF', supervisor: 'Dr. Khadija Alami', supervisorInitials: 'KA', domain: 'NLP', progress: 60, status: 'En cours' },
    { id: 7, title: 'Application IoT Smart Home', student: 'Rachid Amrani', studentInitials: 'RA', supervisor: 'Dr. Youssef Mansouri', supervisorInitials: 'YM', domain: 'IoT', progress: 20, status: 'En cours' },
    { id: 8, title: 'Détection de fraude bancaire', student: 'Salma Kettani', studentInitials: 'SK', supervisor: 'Dr. Mohamed Tazi', supervisorInitials: 'MT', domain: 'Data Science', progress: 85, status: 'En cours' }
  ];

  return (
    <Layout pageTitle="Tous les PFE's" userName="Chef" userInitials="CH">
      <PageHeader
        title="Tous les PFE's"
        subtitle="Vue d'ensemble de tous les projets de fin d'études du département"
      />

      <div className="stats-row">
        <StatCard title="Total PFEs" value="8" subtitle="Tous projets" color="blue" icon="folder" />
        <StatCard title="En cours" value="6" subtitle="Projets actifs" color="green" icon="progress" />
        <StatCard title="Terminés" value="2" subtitle="Projets complétés" color="purple" icon="check" />
        <StatCard title="Encadrants" value="5" subtitle="Professeurs actifs" color="yellow" icon="professors" />
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Rechercher un PFE..."
      />
    </Layout>
  );
};

export default TousLesPfes;
