import React from 'react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader } from '../components/common';
import './Etudiants.css';

const Etudiants = () => {
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
    { key: 'cne', label: 'CNE' },
    { key: 'filiere', label: 'Filière' },
    { key: 'niveau', label: 'Niveau' },
    {
      key: 'hasPfe',
      label: 'PFE Assigné',
      render: (value) => (
        <span className={`status-badge status-badge--${value ? 'active' : 'pending'}`}>
          {value ? 'Oui' : 'Non'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value) => (
        <span className={`status-badge status-badge--${value === 'Inscrit' ? 'active' : 'inactive'}`}>
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
    { id: 1, name: 'Hamza El Amrani', initials: 'HE', email: 'h.elamrani@etu.univ.ma', cne: 'R130456789', filiere: 'Génie Informatique', niveau: 'Master 2', hasPfe: true, status: 'Inscrit' },
    { id: 2, name: 'Sara Bennani', initials: 'SB', email: 's.bennani@etu.univ.ma', cne: 'R130567890', filiere: 'Génie Informatique', niveau: 'Master 2', hasPfe: true, status: 'Inscrit' },
    { id: 3, name: 'Omar Idrissi', initials: 'OI', email: 'o.idrissi@etu.univ.ma', cne: 'R130678901', filiere: 'Data Science', niveau: 'Master 2', hasPfe: false, status: 'Inscrit' },
    { id: 4, name: 'Nadia Chraibi', initials: 'NC', email: 'n.chraibi@etu.univ.ma', cne: 'R130789012', filiere: 'Réseaux', niveau: 'Licence 3', hasPfe: false, status: 'Inscrit' },
    { id: 5, name: 'Yassine Berrada', initials: 'YB', email: 'y.berrada@etu.univ.ma', cne: 'R130890123', filiere: 'Génie Informatique', niveau: 'Master 2', hasPfe: true, status: 'Diplômé' }
  ];

  const AddButton = (
    <button className="btn btn--primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Ajouter un étudiant
    </button>
  );

  return (
    <Layout pageTitle="Étudiants" userName="Chef" userInitials="CH">
      <PageHeader
        title="Étudiants"
        subtitle="Gérez la liste des étudiants inscrits en PFE"
        action={AddButton}
      />
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Rechercher un étudiant..."
      />
    </Layout>
  );
};

export default Etudiants;
