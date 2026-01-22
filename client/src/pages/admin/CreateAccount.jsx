import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { PageHeader } from '../../components/common';
import { adminService, filiereService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const CreateAccount = () => {
  const { user } = useAuth();
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '0', // 0 = Professor, 1 = Chef Département
    filiere: ''
  });

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'AD';

  useEffect(() => {
    const fetchFilieres = async () => {
      try {
        const response = await filiereService.getAll();
        if (response?.data) {
          setFilieres(response.data);
        }
      } catch (error) {
        console.error('Error fetching filieres:', error);
      }
    };

    fetchFilieres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.email || !formData.password || !formData.filiere) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      await adminService.createAccount({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: parseInt(formData.role),
        filiere: parseInt(formData.filiere)
      });

      setSuccess('Compte créé avec succès!');
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: '0',
        filiere: ''
      });
    } catch (error) {
      console.error('Error creating account:', error);
      setError(error.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout pageTitle="Créer un compte" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Créer un compte"
        subtitle="Créer un nouveau compte professeur ou chef de département"
      />

      <div className="admin-form">
        <h3 className="admin-form__title">Informations du compte</h3>

        {error && <div className="admin-form__error">{error}</div>}
        {success && <div className="admin-form__success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form__group">
            <label className="admin-form__label">Prénom</label>
            <input
              type="text"
              name="firstName"
              className="admin-form__input"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">Nom</label>
            <input
              type="text"
              name="lastName"
              className="admin-form__input"
              placeholder="Nom"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">Email *</label>
            <input
              type="email"
              name="email"
              className="admin-form__input"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">Mot de passe *</label>
            <input
              type="password"
              name="password"
              className="admin-form__input"
              placeholder="Mot de passe (min. 6 caractères)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">Rôle *</label>
            <select
              name="role"
              className="admin-form__select"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="0">Professeur</option>
              <option value="1">Chef de Département</option>
            </select>
          </div>

          <div className="admin-form__group">
            <label className="admin-form__label">Filière / Département *</label>
            <select
              name="filiere"
              className="admin-form__select"
              value={formData.filiere}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une filière</option>
              {filieres.map(fil => (
                <option key={fil.idFiliere} value={fil.idFiliere}>
                  {fil.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="admin-form__submit"
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Créer le compte'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateAccount;
