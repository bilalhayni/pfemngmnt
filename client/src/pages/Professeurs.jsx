import React from 'react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader } from '../components/common';
import './Professeurs.css';

const Professeurs = () => {
  const columns = [
    {
      key: 'name',
      label: 'Professeur',
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
    { key: 'department', label: 'Département' },
    { key: 'specialty', label: 'Spécialité' },
    { key: 'pfesCount', label: 'PFEs Encadrés' },
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
          <button className="table-action-btn table-action-btn--view" title="Voir">
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
          <button className="table-action-btn table-action-btn--delete" title="Supprimer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  const data = [
    { id: 1, name: 'Dr. Ahmed Benali', initials: 'AB', email: 'a.benali@univ.ma', department: 'Informatique', specialty: 'IA & Machine Learning', pfesCount: 5, status: 'Actif' },
    { id: 2, name: 'Dr. Fatima Zahra', initials: 'FZ', email: 'f.zahra@univ.ma', department: 'Informatique', specialty: 'Réseaux', pfesCount: 3, status: 'Actif' },
    { id: 3, name: 'Dr. Mohamed Tazi', initials: 'MT', email: 'm.tazi@univ.ma', department: 'Mathématiques', specialty: 'Data Science', pfesCount: 4, status: 'Actif' },
    { id: 4, name: 'Dr. Khadija Alami', initials: 'KA', email: 'k.alami@univ.ma', department: 'Informatique', specialty: 'Développement Web', pfesCount: 6, status: 'Inactif' },
    { id: 5, name: 'Dr. Youssef Mansouri', initials: 'YM', email: 'y.mansouri@univ.ma', department: 'Informatique', specialty: 'Sécurité Informatique', pfesCount: 2, status: 'Actif' }
  ];

  const AddButton = (
    <button className="btn btn--primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Ajouter un professeur
    </button>
  );

  return (
    <Layout pageTitle="Professeurs" userName="Chef" userInitials="CH">
      <PageHeader
        title="Professeurs"
        subtitle="Gérez la liste des professeurs de votre département"
        action={AddButton}
      />
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Rechercher un professeur..."
      />
    </Layout>
  );
};

export default Professeurs;
