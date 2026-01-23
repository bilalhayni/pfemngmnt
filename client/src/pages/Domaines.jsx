import React, { useState, useEffect } from 'react';
import { LayoutGrid } from 'lucide-react';
import { Layout } from '../components/layout';
import { DataTable, PageHeader } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { chefDepartementService } from '../services/api';
import './Domaines.css';

const Domaines = () => {
  const { user } = useAuth();
  const [domains, setDomains] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [showAddPrerequis, setShowAddPrerequis] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');
  const [newPrerequisName, setNewPrerequisName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Chef';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'CH';

  const colors = ['#a65b43', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

  const fetchData = async () => {
    if (!user?.idFiliere) return;

    setLoading(true);
    try {
      const [domainsResponse, prerequisResponse] = await Promise.all([
        chefDepartementService.getDomains(user.idFiliere),
        chefDepartementService.getPrerequisites(user.idFiliere)
      ]);

      if (domainsResponse?.data) {
        const formattedDomains = domainsResponse.data.map((domain, index) => ({
          id: domain.id_domaine,
          name: domain.name,
          color: colors[index % colors.length],
          type: 'Domaine'
        }));
        setDomains(formattedDomains);
      }

      if (prerequisResponse?.data) {
        const formattedPrerequis = prerequisResponse.data.map((prereq, index) => ({
          id: prereq.idprerequis,
          name: prereq.name,
          color: colors[(index + 3) % colors.length],
          type: 'Prérequis'
        }));
        setPrerequisites(formattedPrerequis);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!newDomainName.trim()) return;

    setSubmitting(true);
    try {
      await chefDepartementService.addDomain({
        idFiliere: user.idFiliere,
        name: newDomainName.trim()
      });
      setNewDomainName('');
      setShowAddDomain(false);
      fetchData();
    } catch (error) {
      console.error('Error adding domain:', error);
      alert('Erreur lors de l\'ajout du domaine');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPrerequis = async (e) => {
    e.preventDefault();
    if (!newPrerequisName.trim()) return;

    setSubmitting(true);
    try {
      await chefDepartementService.addPrerequisite({
        idFiliere: user.idFiliere,
        name: newPrerequisName.trim()
      });
      setNewPrerequisName('');
      setShowAddPrerequis(false);
      fetchData();
    } catch (error) {
      console.error('Error adding prerequisite:', error);
      alert('Erreur lors de l\'ajout du prérequis');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nom',
      render: (value, row) => (
        <div className="domain-name">
          <div className="domain-icon" style={{ backgroundColor: row.color }}>
            <LayoutGrid size={16} />
          </div>
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <span className={`status-badge status-badge--${value === 'Domaine' ? 'active' : 'in-progress'}`}>
          {value}
        </span>
      )
    }
  ];

  // Combine domains and prerequisites for the table
  const allItems = [
    ...domains,
    ...prerequisites
  ];

  if (loading) {
    return (
      <Layout pageTitle="Domaines PFE" userName={userName} userInitials={userInitials}>
        <div className="loading-container">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Domaines PFE" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Domaines & Prérequis"
        subtitle="Gérez les domaines et prérequis des projets de fin d'études"
      />

      {/* Add Domain Form */}
      <div className="add-forms-container">
        <div className="add-form-section">
          <h3>Domaines ({domains.length})</h3>
          {showAddDomain ? (
            <form onSubmit={handleAddDomain} className="inline-form">
              <input
                type="text"
                value={newDomainName}
                onChange={(e) => setNewDomainName(e.target.value)}
                placeholder="Nom du domaine"
                disabled={submitting}
              />
              <button type="submit" className="btn btn--primary" disabled={submitting}>
                {submitting ? '...' : 'Ajouter'}
              </button>
              <button type="button" className="btn btn--secondary" onClick={() => setShowAddDomain(false)}>
                Annuler
              </button>
            </form>
          ) : (
            <button className="btn btn--primary" onClick={() => setShowAddDomain(true)}>
              + Nouveau domaine
            </button>
          )}
        </div>

        <div className="add-form-section">
          <h3>Prérequis ({prerequisites.length})</h3>
          {showAddPrerequis ? (
            <form onSubmit={handleAddPrerequis} className="inline-form">
              <input
                type="text"
                value={newPrerequisName}
                onChange={(e) => setNewPrerequisName(e.target.value)}
                placeholder="Nom du prérequis"
                disabled={submitting}
              />
              <button type="submit" className="btn btn--primary" disabled={submitting}>
                {submitting ? '...' : 'Ajouter'}
              </button>
              <button type="button" className="btn btn--secondary" onClick={() => setShowAddPrerequis(false)}>
                Annuler
              </button>
            </form>
          ) : (
            <button className="btn btn--primary" onClick={() => setShowAddPrerequis(true)}>
              + Nouveau prérequis
            </button>
          )}
        </div>
      </div>

      {allItems.length === 0 ? (
        <div className="empty-state">
          <p>Aucun domaine ou prérequis trouvé. Commencez par en ajouter.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={allItems}
          searchPlaceholder="Rechercher..."
        />
      )}
    </Layout>
  );
};

export default Domaines;
