import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, LayoutGrid, Users, Send, ArrowLeft, AlertCircle } from 'lucide-react';
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
          <AlertCircle size={48} />
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
              <User size={16} />
              <span>Encadrant: {pfe.fname}</span>
            </div>
            <div className="pfe-details__meta-item">
              <LayoutGrid size={16} />
              <span>Domaine: {pfe.domaine || 'Non spécifié'}</span>
            </div>
            <div className="pfe-details__meta-item">
              <Users size={16} />
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
            <Send size={16} />
            {applying ? 'Postulation en cours...' : 'Postuler à ce PFE'}
          </button>
          <Link to="/student/pfe" className="pfe-details__back-btn">
            <ArrowLeft size={16} />
            Retour à la liste
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PfeDetails;
