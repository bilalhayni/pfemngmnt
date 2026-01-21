import React from 'react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader } from '../components/common';
import './Domaines.css';

const Domaines = () => {
  const columns = [
    {
      key: 'name',
      label: 'Domaine',
      render: (value, row) => (
        <div className="domain-name">
          <div className="domain-icon" style={{ backgroundColor: row.color }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <span>{value}</span>
        </div>
      )
    },
    { key: 'description', label: 'Description' },
    { key: 'pfesCount', label: 'Nombre de PFEs' },
    { key: 'professorsCount', label: 'Encadrants' },
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
          <button className="table-action-btn table-action-btn--view" title="Voir PFEs">
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
    { id: 1, name: 'Développement Web', description: 'Applications web, frameworks modernes, APIs REST', pfesCount: 12, professorsCount: 3, color: '#4f6bed', status: 'Actif' },
    { id: 2, name: 'Intelligence Artificielle', description: 'Machine Learning, Deep Learning, NLP', pfesCount: 8, professorsCount: 2, color: '#22c55e', status: 'Actif' },
    { id: 3, name: 'Mobile', description: 'Applications iOS, Android, React Native, Flutter', pfesCount: 6, professorsCount: 2, color: '#f59e0b', status: 'Actif' },
    { id: 4, name: 'Data Science', description: 'Analyse de données, Big Data, Visualisation', pfesCount: 5, professorsCount: 2, color: '#8b5cf6', status: 'Actif' },
    { id: 5, name: 'Réseaux & Sécurité', description: 'Cybersécurité, administration réseaux, IoT', pfesCount: 4, professorsCount: 1, color: '#ef4444', status: 'Actif' }
  ];

  const AddButton = (
    <button className="btn btn--primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Ajouter un domaine
    </button>
  );

  return (
    <Layout pageTitle="Domaines PFE" userName="Chef" userInitials="CH">
      <PageHeader
        title="Domaines PFE"
        subtitle="Gérez les spécialités et domaines des projets de fin d'études"
        action={AddButton}
      />

      <div className="domains-summary">
        <div className="domains-summary__card">
          <div className="domains-summary__header">
            <h3>Répartition des PFEs par domaine</h3>
          </div>
          <div className="domains-summary__bars">
            {data.map((domain) => (
              <div key={domain.id} className="domain-bar">
                <div className="domain-bar__label">
                  <span className="domain-bar__name">{domain.name}</span>
                  <span className="domain-bar__count">{domain.pfesCount} PFEs</span>
                </div>
                <div className="domain-bar__track">
                  <div
                    className="domain-bar__fill"
                    style={{
                      width: `${(domain.pfesCount / 12) * 100}%`,
                      backgroundColor: domain.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Rechercher un domaine..."
      />
    </Layout>
  );
};

export default Domaines;
