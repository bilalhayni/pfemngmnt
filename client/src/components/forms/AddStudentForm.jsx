import React from 'react';
import MultiStepForm from './MultiStepForm';
import './AddForms.css';

const AddStudentForm = ({ onSubmit, onCancel }) => {
  const steps = [
    {
      title: 'Informations personnelles',
      description: "Entrez les informations de l'étudiant",
      fields: [
        { name: 'firstName', label: 'Prénom', placeholder: 'Prénom', required: true },
        { name: 'lastName', label: 'Nom', placeholder: 'Nom', required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'etudiant@ump.ac.ma', required: true, fullWidth: true },
        { name: 'phone', label: 'Téléphone', type: 'tel', placeholder: '+212 6XX XXX XXX' },
        { name: 'dateOfBirth', label: 'Date de naissance', type: 'date' }
      ]
    },
    {
      title: 'Informations académiques',
      description: 'Détails du parcours académique',
      fields: [
        { name: 'cne', label: 'CNE', placeholder: 'Code National Étudiant', required: true },
        { name: 'cin', label: 'CIN', placeholder: 'Carte Identité Nationale', required: true },
        {
          name: 'filiere',
          label: 'Filière',
          type: 'select',
          required: true,
          options: [
            { value: 'smi', label: 'SMI - Sciences Mathématiques et Informatique' },
            { value: 'sma', label: 'SMA - Sciences Mathématiques et Applications' },
            { value: 'smp', label: 'SMP - Sciences de la Matière Physique' },
            { value: 'smc', label: 'SMC - Sciences de la Matière Chimie' },
            { value: 'svt', label: 'SVT - Sciences de la Vie et de la Terre' }
          ]
        },
        {
          name: 'niveau',
          label: 'Niveau',
          type: 'select',
          required: true,
          options: [
            { value: 'licence3', label: 'Licence 3ème année' },
            { value: 'master1', label: 'Master 1ère année' },
            { value: 'master2', label: 'Master 2ème année' }
          ]
        },
        { name: 'anneeInscription', label: "Année d'inscription", type: 'number', placeholder: '2024', required: true },
        { name: 'moyenne', label: 'Moyenne générale', type: 'number', placeholder: '14.5', hint: 'Note sur 20' }
      ]
    },
    {
      title: 'Compte & Préférences',
      description: "Configuration du compte étudiant",
      fields: [
        { name: 'username', label: "Nom d'utilisateur", placeholder: 'nom.prenom', required: true, fullWidth: true },
        { name: 'password', label: 'Mot de passe temporaire', type: 'password', placeholder: '••••••••', required: true, hint: "L'étudiant devra le changer" },
        {
          name: 'domainePreference',
          label: 'Domaine de préférence PFE',
          type: 'select',
          options: [
            { value: 'web', label: 'Développement Web' },
            { value: 'ai', label: 'Intelligence Artificielle' },
            { value: 'mobile', label: 'Mobile' },
            { value: 'data', label: 'Data Science' },
            { value: 'security', label: 'Réseaux & Sécurité' }
          ]
        },
        { name: 'sendCredentials', type: 'checkbox', checkboxLabel: 'Envoyer les identifiants par email', fullWidth: true },
        { name: 'isActive', type: 'checkbox', checkboxLabel: 'Compte actif', fullWidth: true }
      ]
    }
  ];

  const handleSubmit = (formData) => {
    console.log('New Student:', formData);
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
          title="Nouvel Étudiant"
          subtitle="Ajoutez un étudiant à la plateforme"
          submitLabel="Ajouter l'étudiant"
        />
      </div>
    </div>
  );
};

export default AddStudentForm;
