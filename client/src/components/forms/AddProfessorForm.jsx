import React from 'react';
import MultiStepForm from './MultiStepForm';
import './AddForms.css';

const AddProfessorForm = ({ onSubmit, onCancel }) => {
  const steps = [
    {
      title: 'Informations personnelles',
      description: 'Entrez les informations du professeur',
      fields: [
        { name: 'firstName', label: 'Prénom', placeholder: 'Prénom', required: true },
        { name: 'lastName', label: 'Nom', placeholder: 'Nom', required: true },
        { name: 'email', label: 'Email professionnel', type: 'email', placeholder: 'professeur@ump.ac.ma', required: true, fullWidth: true },
        { name: 'phone', label: 'Téléphone', type: 'tel', placeholder: '+212 6XX XXX XXX' },
        { name: 'cin', label: 'CIN', placeholder: 'Carte Identité Nationale', required: true }
      ]
    },
    {
      title: 'Informations professionnelles',
      description: 'Détails académiques et spécialités',
      fields: [
        {
          name: 'grade',
          label: 'Grade',
          type: 'select',
          required: true,
          options: [
            { value: 'pa', label: 'Professeur Assistant' },
            { value: 'ph', label: 'Professeur Habilité' },
            { value: 'pes', label: "Professeur de l'Enseignement Supérieur" }
          ]
        },
        {
          name: 'department',
          label: 'Département',
          type: 'select',
          required: true,
          options: [
            { value: 'informatique', label: 'Informatique' },
            { value: 'mathematiques', label: 'Mathématiques' },
            { value: 'physique', label: 'Physique' },
            { value: 'chimie', label: 'Chimie' },
            { value: 'biologie', label: 'Biologie' }
          ]
        },
        {
          name: 'specialty',
          label: 'Spécialité',
          type: 'select',
          required: true,
          options: [
            { value: 'web', label: 'Développement Web' },
            { value: 'ai', label: 'Intelligence Artificielle' },
            { value: 'networks', label: 'Réseaux' },
            { value: 'databases', label: 'Bases de données' },
            { value: 'security', label: 'Sécurité informatique' },
            { value: 'embedded', label: 'Systèmes embarqués' }
          ]
        },
        { name: 'dateRecrutement', label: 'Date de recrutement', type: 'date', required: true },
        { name: 'bureau', label: 'Numéro de bureau', placeholder: 'Ex: B-204' },
        { name: 'maxPfes', label: 'Nombre max de PFEs', type: 'number', placeholder: '5', hint: 'Capacité d\'encadrement annuelle' }
      ]
    },
    {
      title: 'Compte & Accès',
      description: 'Configuration du compte professeur',
      fields: [
        { name: 'username', label: "Nom d'utilisateur", placeholder: 'nom.prenom', required: true },
        { name: 'password', label: 'Mot de passe temporaire', type: 'password', placeholder: '••••••••', required: true, hint: 'Le professeur devra le changer' },
        {
          name: 'role',
          label: 'Rôle dans le système',
          type: 'select',
          required: true,
          options: [
            { value: 'professor', label: 'Professeur' },
            { value: 'coordinator', label: 'Coordinateur de filière' },
            { value: 'head', label: 'Chef de département' }
          ]
        },
        { name: 'canValidatePfe', type: 'checkbox', checkboxLabel: 'Peut valider les PFEs', fullWidth: true },
        { name: 'sendCredentials', type: 'checkbox', checkboxLabel: 'Envoyer les identifiants par email', fullWidth: true },
        { name: 'isActive', type: 'checkbox', checkboxLabel: 'Compte actif', fullWidth: true }
      ]
    }
  ];

  const handleSubmit = (formData) => {
    console.log('New Professor:', formData);
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="add-form-overlay">
      <div className="add-form-container">
        <button className="add-form-close" onClick={onCancel}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <MultiStepForm
          steps={steps}
          onSubmit={handleSubmit}
          title="Nouveau Professeur"
          subtitle="Ajoutez un professeur à la plateforme"
          submitLabel="Ajouter le professeur"
        />
      </div>
    </div>
  );
};

export default AddProfessorForm;
