import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Layout } from '../../components/layout';
import { PageHeader, DataTable } from '../../components/common';
import { filiereService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const CreateFiliere = () => {
  const { user } = useAuth();
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'AD';

  const fetchFilieres = async () => {
    try {
      const response = await filiereService.getAll();
      if (response?.data) {
        const formattedData = response.data.map(fil => ({
          id: fil.idFiliere,
          name: fil.name
        }));
        setFilieres(formattedData);
      }
    } catch (error) {
      console.error('Error fetching filieres:', error);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchFilieres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Veuillez entrer un nom de filière');
      return;
    }

    setLoading(true);
    try {
      await filiereService.create({ name: name.trim() });
      setSuccess('Filière créée avec succès!');
      setName('');
      await fetchFilieres();
    } catch (error) {
      console.error('Error creating filiere:', error);
      setError(error.response?.data?.message || 'Erreur lors de la création de la filière');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, filiereName) => {
    if (!window.confirm(`Voulez-vous supprimer la filière "${filiereName}" ? Cette action est irréversible.`)) return;

    try {
      await filiereService.delete(id);
      await fetchFilieres();
      alert('Filière supprimée avec succès!');
    } catch (error) {
      console.error('Error deleting filiere:', error);
      alert('Erreur lors de la suppression de la filière');
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID'
    },
    {
      key: 'name',
      label: 'Nom de la filière'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="table-actions">
          <button
            className="table-action-btn table-action-btn--delete"
            title="Supprimer"
            onClick={() => handleDelete(row.id, row.name)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout pageTitle="Gestion des filières" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Gestion des filières"
        subtitle="Ajouter et gérer les filières du système"
      />

      <div className="admin-form" style={{ marginBottom: '2rem' }}>
        <h3 className="admin-form__title">Ajouter une nouvelle filière</h3>

        {error && <div className="admin-form__error">{error}</div>}
        {success && <div className="admin-form__success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form__group">
            <label className="admin-form__label">Nom de la filière *</label>
            <input
              type="text"
              className="admin-form__input"
              placeholder="Ex: Génie Informatique"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
                setSuccess('');
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-form__submit"
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Ajouter la filière'}
          </button>
        </form>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Filières existantes
        </h3>
        {tableLoading ? (
          <div className="admin-loading">Chargement...</div>
        ) : filieres.length === 0 ? (
          <div className="admin-empty">
            <p>Aucune filière enregistrée</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filieres}
            searchPlaceholder="Rechercher une filière..."
          />
        )}
      </div>
    </Layout>
  );
};

export default CreateFiliere;
