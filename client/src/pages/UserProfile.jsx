import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '../components/layout';
import { PageHeader } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { studentService, professorService } from '../services/api';
import './UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, ROLES } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Utilisateur';
  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`
    : 'US';

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Check if user has permission to view profiles
      if (!canViewUserProfile()) {
        setError('Vous n\'avez pas la permission de voir ce profil');
        setLoading(false);
        return;
      }

      // Check if user is trying to view their own profile
      if (parseInt(userId) === user?.id) {
        // Redirect to their own profile page
        redirectToOwnProfile();
        return;
      }

      setLoading(true);
      try {
        // Try to fetch as student first, then as professor
        let response = null;
        try {
          response = await studentService.getById(userId);
          if (response?.data) {
            setProfile({ ...response.data, userType: 'student' });
          }
        } catch (err) {
          // If not a student, try professor
          response = await professorService.getById(userId);
          if (response?.data) {
            setProfile({ ...response.data, userType: 'professor' });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Impossible de charger le profil utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, user]);

  const canViewUserProfile = () => {
    // Admin, Chef, and Professor can view user profiles
    return user?.role === ROLES.ADMIN ||
           user?.role === ROLES.CHEF_DEPARTEMENT ||
           user?.role === ROLES.PROFESSOR;
  };

  const redirectToOwnProfile = () => {
    switch (user?.role) {
      case ROLES.PROFESSOR:
        navigate('/prof/profile');
        break;
      case ROLES.STUDENT:
        navigate('/student/profile');
        break;
      case ROLES.ADMIN:
        navigate('/admin/profile');
        break;
      case ROLES.CHEF_DEPARTEMENT:
        navigate('/profile');
        break;
      default:
        navigate('/');
    }
  };

  const getRoleName = (userType) => {
    if (userType === 'student') return 'Étudiant';
    if (userType === 'professor') return 'Professeur';
    return 'Utilisateur';
  };

  const getStatusBadge = (valid) => {
    const isActive = valid === 1;
    return (
      <span className={`status-badge status-badge--${isActive ? 'active' : 'inactive'}`}>
        {isActive ? 'Actif' : 'Inactif'}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout pageTitle="Profil Utilisateur" userName={userName} userInitials={userInitials}>
        <div className="loading-container">Chargement...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout pageTitle="Profil Utilisateur" userName={userName} userInitials={userInitials}>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => navigate(-1)} className="btn-back">
            Retour
          </button>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout pageTitle="Profil Utilisateur" userName={userName} userInitials={userInitials}>
        <div className="error-container">
          <p className="error-message">Utilisateur non trouvé</p>
          <button onClick={() => navigate(-1)} className="btn-back">
            Retour
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Profil Utilisateur" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Profil Utilisateur"
        subtitle="Détails de l'utilisateur"
      />

      <div className="user-profile">
        <div className="user-profile__header">
          <button onClick={() => navigate(-1)} className="user-profile__back">
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>

        <div className="user-profile__content">
          {/* Profile Card */}
          <div className="user-profile__card">
            <div className="user-profile__avatar">
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </div>
            <h2 className="user-profile__name">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="user-profile__email">{profile.email}</p>
            <div className="user-profile__role">
              {getRoleName(profile.userType)}
            </div>
            <div className="user-profile__status">
              {getStatusBadge(profile.valid)}
            </div>
          </div>

          {/* Profile Details */}
          <div className="user-profile__details">
            <h3 className="user-profile__details-title">Informations</h3>

            <div className="user-profile__details-grid">
              <div className="user-profile__detail-item">
                <span className="user-profile__detail-label">Prénom</span>
                <span className="user-profile__detail-value">{profile.firstName || '-'}</span>
              </div>

              <div className="user-profile__detail-item">
                <span className="user-profile__detail-label">Nom</span>
                <span className="user-profile__detail-value">{profile.lastName || '-'}</span>
              </div>

              <div className="user-profile__detail-item">
                <span className="user-profile__detail-label">Email</span>
                <span className="user-profile__detail-value">{profile.email || '-'}</span>
              </div>

              <div className="user-profile__detail-item">
                <span className="user-profile__detail-label">Téléphone</span>
                <span className="user-profile__detail-value">{profile.phone || '-'}</span>
              </div>

              <div className="user-profile__detail-item">
                <span className="user-profile__detail-label">Filière</span>
                <span className="user-profile__detail-value">{profile.filiere || '-'}</span>
              </div>

              <div className="user-profile__detail-item">
                <span className="user-profile__detail-label">Type</span>
                <span className="user-profile__detail-value">
                  {getRoleName(profile.userType)}
                </span>
              </div>

              {profile.userType === 'student' && profile.prerequisites && (
                <div className="user-profile__detail-item user-profile__detail-item--full">
                  <span className="user-profile__detail-label">Prérequis</span>
                  <span className="user-profile__detail-value">{profile.prerequisites}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
