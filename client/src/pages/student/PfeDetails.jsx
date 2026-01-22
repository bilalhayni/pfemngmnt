import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../../components/layout';
import { PageHeader } from '../../components/common';
import { studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './StudentPages.css';

const PfeDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [pfe, setPfe] = useState(null);
  const [prerequisites, setPrerequisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Étudiant';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'ET';

  useEffect(() => {
    const fetchPfeDetails = async () => {
      try {
        const [pfeResponse, prereqResponse] = await Promise.all([
          studentService.getPfeDetails(id),
          studentService.getPfePrerequisites(id)
        ]);

        if (pfeResponse?.data) {
          setPfe(pfeResponse.data);
        }

        if (prereqResponse?.data) {
          setPrerequisites(prereqResponse.data);
        }
      } catch (error) {
        console.error('Error fetching PFE details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPfeDetails();
  }, [id]);

  const handleApply = async () => {
    if (!window.confirm(`Voulez-vous postuler à ce PFE ?`)) return;

    const userId = Cookies.get('userId');
    setApplying(true);

    try {
      await studentService.applyToPfe({
        id_pfe: id,
        id_user: userId,
        id_prof: pfe.idProf
      });
      alert('Postulation envoyée avec succès!');
    } catch (error) {
      console.error('Error applying to PFE:', error);
      alert(error.response?.data?.message || 'Erreur lors de la postulation');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Layout pageTitle="Détails du PFE" userName={userName} userInitials={userInitials}>
        <div className="student-loading">Chargement...</div>
      </Layout>
    );
  }

  if (!pfe) {
    return (
      <Layout pageTitle="Détails du PFE" userName={userName} userInitials={userInitials}>
        <div className="student-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>PFE non trouvé</p>
          <Link to="/student/pfe" style={{ marginTop: '1rem', color: '#a65b43', textDecoration: 'none' }}>
            Retour à la liste des PFEs
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Détails du PFE" userName={userName} userInitials={userInitials}>
      <PageHeader
        title="Détails du PFE"
        subtitle="Informations complètes sur le projet"
      />

      <div className="pfe-details">
        <div className="pfe-details__header">
          <h2 className="pfe-details__title">{pfe.titre}</h2>
          <div className="pfe-details__meta">
            <div className="pfe-details__meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Encadrant: {pfe.fname}</span>
            </div>
            <div className="pfe-details__meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Domaine: {pfe.domaine || 'Non spécifié'}</span>
            </div>
            <div className="pfe-details__meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Places: {pfe.nbr_etd || 1} étudiant(s)</span>
            </div>
          </div>
        </div>

        <div className="pfe-details__section">
          <h3 className="pfe-details__section-title">Description</h3>
          <p className="pfe-details__description">
            {pfe.description || 'Aucune description disponible pour ce PFE.'}
          </p>
        </div>

        {prerequisites.length > 0 && (
          <div className="pfe-details__section">
            <h3 className="pfe-details__section-title">Prérequis</h3>
            <div className="pfe-details__prerequisites">
              {prerequisites.map((prereq, index) => (
                <span key={index} className="pfe-details__prerequisite">
                  {prereq.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pfe-details__section">
          <h3 className="pfe-details__section-title">Contact</h3>
          <p className="pfe-details__description">
            Email: {pfe.email || 'Non disponible'}<br />
            Téléphone: {pfe.phone || 'Non disponible'}
          </p>
        </div>

        <div className="pfe-details__actions">
          <button
            className="pfe-details__apply-btn"
            onClick={handleApply}
            disabled={applying}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
            {applying ? 'Postulation en cours...' : 'Postuler à ce PFE'}
          </button>
          <Link to="/student/pfe" className="pfe-details__back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Retour à la liste
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PfeDetails;
