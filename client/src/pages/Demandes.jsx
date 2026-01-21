import React from 'react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader, StatCard } from '../components/common';
import './Demandes.css';

const Demandes = () => {
  const columns = [
    { key: 'id', label: '#' },
    {
      key: 'student',
      label: 'Demandeur',
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
    {
      key: 'type',
      label: 'Type',
      render: (value) => {
        const typeColors = {
          'Changement sujet': 'blue',
          'Changement encadrant': 'purple',
          'Extension délai': 'yellow',
          'Demande soutenance': 'green'
        };
        return <span className={`request-type request-type--${typeColors[value] || 'blue'}`}>{value}</span>;
      }
    },
    { key: 'subject', label: 'Objet' },
    { key: 'date', label: 'Date' },
    {
      key: 'priority',
      label: 'Priorité',
      render: (value) => {
        const priorityClass = value === 'Haute' ? 'high' : value === 'Moyenne' ? 'medium' : 'low';
        return <span className={`priority-badge priority-badge--${priorityClass}`}>{value}</span>;
      }
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value) => {
        const statusClass = value === 'Approuvée' ? 'completed' : value === 'En attente' ? 'pending' : value === 'En cours' ? 'in-progress' : 'inactive';
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
          {row.status === 'En attente' && (
            <>
              <button className="table-action-btn table-action-btn--approve" title="Approuver">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <button className="table-action-btn table-action-btn--reject" title="Rejeter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  const data = [
    { id: 'DEM-001', student: 'Hamza El Amrani', studentInitials: 'HE', email: 'h.elamrani@etu.univ.ma', type: 'Extension délai', subject: 'Besoin de 2 semaines supplémentaires', date: '15/01/2025', priority: 'Haute', status: 'En attente' },
    { id: 'DEM-002', student: 'Sara Bennani', studentInitials: 'SB', email: 's.bennani@etu.univ.ma', type: 'Changement sujet', subject: 'Modification du périmètre du projet', date: '14/01/2025', priority: 'Moyenne', status: 'En cours' },
    { id: 'DEM-003', student: 'Omar Idrissi', studentInitials: 'OI', email: 'o.idrissi@etu.univ.ma', type: 'Demande soutenance', subject: 'Planification de la soutenance', date: '13/01/2025', priority: 'Haute', status: 'Approuvée' },
    { id: 'DEM-004', student: 'Nadia Chraibi', studentInitials: 'NC', email: 'n.chraibi@etu.univ.ma', type: 'Changement encadrant', subject: 'Demande de co-encadrement', date: '12/01/2025', priority: 'Basse', status: 'En attente' },
    { id: 'DEM-005', student: 'Yassine Berrada', studentInitials: 'YB', email: 'y.berrada@etu.univ.ma', type: 'Demande soutenance', subject: 'Date de soutenance souhaitée', date: '11/01/2025', priority: 'Haute', status: 'Approuvée' },
    { id: 'DEM-006', student: 'Laila Fassi', studentInitials: 'LF', email: 'l.fassi@etu.univ.ma', type: 'Extension délai', subject: 'Retard dû à des problèmes techniques', date: '10/01/2025', priority: 'Moyenne', status: 'Rejetée' }
  ];

  return (
    <Layout pageTitle="Demandes" userName="Chef" userInitials="CH">
      <PageHeader
        title="Demandes"
        subtitle="Gérez les demandes des étudiants concernant leurs PFE"
      />

      <div className="stats-row">
        <StatCard title="Total" value="6" subtitle="Demandes" color="blue" icon="requests" />
        <StatCard title="En attente" value="2" subtitle="À traiter" color="yellow" icon="pending" />
        <StatCard title="Approuvées" value="2" subtitle="Validées" color="green" icon="check" />
        <StatCard title="Rejetées" value="1" subtitle="Refusées" color="red" icon="rejected" />
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Rechercher une demande..."
      />
    </Layout>
  );
};

export default Demandes;
