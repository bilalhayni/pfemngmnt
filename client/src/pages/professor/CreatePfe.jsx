import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Layout } from '../../components/layout';
import { PageHeader } from '../../components/common';
import { professorPortalService, filiereService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import './ProfessorPages.css';

const CreatePfe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [domains, setDomains] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    nbr_etd: 1,
    domaine: '',
    avancement: 'En cours',
    idPrerequisites: []
  });

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Professeur';
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : 'PR';
  const filId = Cookies.get('filId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [domainsRes, prereqRes] = await Promise.all([
          professorPortalService.getDomains(filId),
          professorPortalService.getPrerequisites(filId)
        ]);

        if (domainsRes?.data) setDomains(domainsRes.data);
        if (prereqRes?.data) setPrerequisites(prereqRes.data);

        // If editing, fetch the PFE data
        if (isEdit) {
          const pfeRes = await professorPortalService.getPfeDetails(id);
          if (pfeRes?.data) {
            const pfe = pfeRes.data;
            setFormData({
              titre: pfe.titre || '',
              description: pfe.description || '',
              nbr_etd: pfe.nbr_etd || 1,
              domaine: pfe.id_domaine || '',
              avancement: pfe.avancement || 'En cours',
              idPrerequisites: []
            });

            // Fetch prerequisites for this PFE
            const pfePrereqRes = await professorPortalService.getPfePrerequisites(id);
            if (pfePrereqRes?.data) {
              const prereqIds = pfePrereqRes.data.map(p => p.idprerequis || p.idPrerequis);
              setFormData(prev => ({ ...prev, idPrerequisites: prereqIds }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [filId, id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handlePrerequisiteChange = (prereqId) => {
    setFormData(prev => {
      const currentPrereqs = prev.idPrerequisites;
      if (currentPrereqs.includes(prereqId)) {
        return { ...prev, idPrerequisites: currentPrereqs.filter(id => id !== prereqId) };
      } else {
        return { ...prev, idPrerequisites: [...currentPrereqs, prereqId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.titre || !formData.domaine) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const userId = Cookies.get('userId');
      const payload = {
        titre: formData.titre,
        description: formData.description,
        nbr_etd: parseInt(formData.nbr_etd),
        domaine: parseInt(formData.domaine),
        filiere: parseInt(filId),
        prof: parseInt(userId),
        avancement: formData.avancement,
        idPrerequisites: formData.idPrerequisites
      };

      if (isEdit) {
        await professorPortalService.updatePfe({ ...payload, idPfe: id });
        alert('PFE modifié avec succès!');
      } else {
        await professorPortalService.createPfe(payload);
        alert('PFE créé avec succès!');
      }

      navigate('/prof/pfe');
    } catch (error) {
      console.error('Error saving PFE:', error);
      setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement du PFE');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Layout pageTitle={isEdit ? "Modifier PFE" : "Créer PFE"} userName={userName} userInitials={userInitials}>
        <div className="professor-loading">Chargement...</div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle={isEdit ? "Modifier PFE" : "Créer PFE"} userName={userName} userInitials={userInitials}>
      <PageHeader
        title={isEdit ? "Modifier le PFE" : "Créer un nouveau PFE"}
        subtitle={isEdit ? "Modifiez les informations du projet" : "Définissez les détails de votre nouveau projet"}
      />

      <div className="professor-form">
        {error && <div className="professor-form__error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="professor-form__group">
            <label className="professor-form__label">Titre du PFE *</label>
            <input
              type="text"
              name="titre"
              className="professor-form__input"
              placeholder="Ex: Développement d'une application web..."
              value={formData.titre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="professor-form__group">
            <label className="professor-form__label">Description</label>
            <textarea
              name="description"
              className="professor-form__textarea"
              placeholder="Décrivez le projet, ses objectifs et les technologies utilisées..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="professor-form__row">
            <div className="professor-form__group">
              <label className="professor-form__label">Domaine *</label>
              <select
                name="domaine"
                className="professor-form__select"
                value={formData.domaine}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un domaine</option>
                {domains.map(domain => (
                  <option key={domain.id_domaine} value={domain.id_domaine}>
                    {domain.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="professor-form__group">
              <label className="professor-form__label">Nombre d'étudiants</label>
              <input
                type="number"
                name="nbr_etd"
                className="professor-form__input"
                min="1"
                max="5"
                value={formData.nbr_etd}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="professor-form__group">
            <label className="professor-form__label">Avancement</label>
            <select
              name="avancement"
              className="professor-form__select"
              value={formData.avancement}
              onChange={handleChange}
            >
              <option value="En cours">En cours</option>
              <option value="En attente">En attente</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>

          {prerequisites.length > 0 && (
            <div className="professor-form__group">
              <label className="professor-form__label">Prérequis</label>
              <div className="professor-form__checkbox-group">
                {prerequisites.map(prereq => (
                  <label key={prereq.idprerequis} className="professor-form__checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.idPrerequisites.includes(prereq.idprerequis)}
                      onChange={() => handlePrerequisiteChange(prereq.idprerequis)}
                    />
                    <span>{prereq.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="professor-form__actions">
            <button
              type="submit"
              className="professor-form__submit"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : (isEdit ? 'Enregistrer les modifications' : 'Créer le PFE')}
            </button>
            <Link to="/prof/pfe" className="professor-form__cancel">
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePfe;
