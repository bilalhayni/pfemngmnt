import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { PageHeader } from '../../components/common';
import { studentService, filiereService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './StudentPages.css';

const StudentProfile = () => {
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

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Étudiant';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'ET';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = Cookies.get('userId');
        const [profileResponse, filieresResponse] = await Promise.all([
          studentService.getProfile(userId),
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
      await studentService.updateProfile({
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
        <div className="student-loading">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Mon Profil" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Mon Profil"
        subtitle="Gérez vos informations personnelles"
      />

      <div className="student-profile">
        {/* Profile Card */}
        <div className="student-profile__card">
          <div className="student-profile__avatar">
            {formData.firstName?.[0]}{formData.lastName?.[0]}
          </div>
          <h3 className="student-profile__name">
            {formData.firstName} {formData.lastName}
          </h3>
          <p className="student-profile__email">{formData.email}</p>

          <div className="student-profile__info">
            <div className="student-profile__info-item">
              <span className="student-profile__info-label">Rôle</span>
              <span className="student-profile__info-value">Étudiant</span>
            </div>
            <div className="student-profile__info-item">
              <span className="student-profile__info-label">Filière</span>
              <span className="student-profile__info-value">{profile?.filiere || '-'}</span>
            </div>
            <div className="student-profile__info-item">
              <span className="student-profile__info-label">Téléphone</span>
              <span className="student-profile__info-value">{formData.phone || '-'}</span>
            </div>
            {profile?.prerequisites && (
              <div className="student-profile__info-item">
                <span className="student-profile__info-label">Prérequis</span>
                <span className="student-profile__info-value">{profile.prerequisites}</span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="student-profile__card">
          <h3 className="student-profile__form-title">Modifier mes informations</h3>

          {error && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="student-profile__form-group">
                <label className="student-profile__form-label">Prénom *</label>
                <input
                  type="text"
                  name="firstName"
                  className="student-profile__form-input"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="student-profile__form-group">
                <label className="student-profile__form-label">Nom *</label>
                <input
                  type="text"
                  name="lastName"
                  className="student-profile__form-input"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="student-profile__form-group">
              <label className="student-profile__form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="student-profile__form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="student-profile__form-group">
              <label className="student-profile__form-label">Téléphone</label>
              <input
                type="tel"
                name="phone"
                className="student-profile__form-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="student-profile__form-group">
              <label className="student-profile__form-label">Filière</label>
              <select
                name="filiere"
                className="student-profile__form-input"
                value={formData.filiere}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              >
                <option value="">Sélectionnez une filière</option>
                {filieres.map(fil => (
                  <option key={fil.idFiliere} value={fil.idFiliere}>
                    {fil.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="student-profile__form-group">
              <label className="student-profile__form-label">Nouveau mot de passe</label>
              <input
                type="password"
                name="password"
                className="student-profile__form-input"
                placeholder="Laissez vide pour garder l'actuel"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="student-profile__form-submit"
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;
