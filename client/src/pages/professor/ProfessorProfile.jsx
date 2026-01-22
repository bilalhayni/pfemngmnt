import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { PageHeader } from '../../components/common';
import { professorPortalService, filiereService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './ProfessorPages.css';

const ProfessorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    filiere: ''
  });

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Professeur';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'PR';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = Cookies.get('userId');
        const [profileResponse, filieresResponse] = await Promise.all([
          professorPortalService.getProfile(userId),
          filiereService.getAll()
        ]);

        if (profileResponse?.data) {
          const p = profileResponse.data;
          setProfile(p);
          setFormData({
            firstName: p.firstName || '',
            lastName: p.lastName || '',
            email: p.email || '',
            phone: p.phone || '',
            password: '',
            filiere: p.idFiliere || ''
          });
        }

        if (filieresResponse?.data) {
          setFilieres(filieresResponse.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const userId = Cookies.get('userId');
      await professorPortalService.updateProfile({
        id: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password || profile.password,
        fil: formData.filiere
      });
      setSuccess('Profil mis à jour avec succès!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout pageTitle="Mon Profil" userName={userName} userInitials={userInitials}>
        <div className="professor-loading">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Mon Profil" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Mon Profil"
        subtitle="Gérez vos informations personnelles"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: '#a65b43',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 600,
            margin: '0 auto 1rem'
          }}>
            {formData.firstName?.[0]}{formData.lastName?.[0]}
          </div>
          <h3 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', margin: '0 0 0.25rem 0' }}>
            {formData.firstName} {formData.lastName}
          </h3>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', margin: 0 }}>{formData.email}</p>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Rôle</span>
              <span style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.875rem' }}>Professeur</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Filière</span>
              <span style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.875rem' }}>{profile?.filiere || '-'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Téléphone</span>
              <span style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.875rem' }}>{formData.phone || '-'}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="professor-form" style={{ maxWidth: 'none' }}>
          <h3 className="professor-form__title">Modifier mes informations</h3>

          {error && <div className="professor-form__error">{error}</div>}
          {success && <div className="professor-form__success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="professor-form__row">
              <div className="professor-form__group">
                <label className="professor-form__label">Prénom *</label>
                <input
                  type="text"
                  name="firstName"
                  className="professor-form__input"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="professor-form__group">
                <label className="professor-form__label">Nom *</label>
                <input
                  type="text"
                  name="lastName"
                  className="professor-form__input"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="professor-form__group">
              <label className="professor-form__label">Email *</label>
              <input
                type="email"
                name="email"
                className="professor-form__input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="professor-form__group">
              <label className="professor-form__label">Téléphone</label>
              <input
                type="tel"
                name="phone"
                className="professor-form__input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="professor-form__group">
              <label className="professor-form__label">Filière</label>
              <select
                name="filiere"
                className="professor-form__select"
                value={formData.filiere}
                onChange={handleChange}
              >
                <option value="">Sélectionnez une filière</option>
                {filieres.map(fil => (
                  <option key={fil.idFiliere} value={fil.idFiliere}>
                    {fil.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="professor-form__group">
              <label className="professor-form__label">Nouveau mot de passe</label>
              <input
                type="password"
                name="password"
                className="professor-form__input"
                placeholder="Laissez vide pour garder l'actuel"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="professor-form__submit"
              disabled={saving}
              style={{ width: '100%' }}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProfessorProfile;
