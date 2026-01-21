import React from 'react';
import MultiStepForm from './MultiStepForm';
import './AddForms.css';

const AddDemandeForm = ({ onSubmit, onCancel }) => {
  const steps = [
    {
      title: 'Type de demande',
      description: 'Sélectionnez le type de votre demande',
      fields: [
        {
          name: 'type',
          label: 'Type de demande',
          type: 'select',
          required: true,
          fullWidth: true,
          options: [
            { value: 'pfe_assignment', label: 'Affectation à un PFE' },
            { value: 'supervisor_change', label: "Changement d'encadrant" },
            { value: 'topic_change', label: 'Changement de sujet' },
            { value: 'extension', label: 'Prolongation de délai' },
            { value: 'other', label: 'Autre demande' }
          ]
        },
        {
          name: 'priority',
          label: 'Priorité',
          type: 'select',
          required: true,
          options: [
            { value: 'high', label: 'Haute' },
            { value: 'medium', label: 'Moyenne' },
            { value: 'low', label: 'Basse' }
          ]
        },
        {
          name: 'student',
          label: 'Étudiant concerné',
          type: 'select',
          required: true,
          options: [
            { value: '1', label: 'Youssef El Amrani - SMI' },
            { value: '2', label: 'Sara Benjelloun - SMI' },
            { value: '3', label: 'Omar Tazi - SMA' },
            { value: '4', label: 'Khadija Fassi - SMI' }
          ]
        }
      ]
    },
    {
      title: 'Détails de la demande',
      description: 'Fournissez les détails nécessaires',
      fields: [
        { name: 'subject', label: 'Objet de la demande', placeholder: 'Résumez votre demande...', required: true, fullWidth: true },
        { name: 'description', label: 'Description détaillée', type: 'textarea', placeholder: 'Expliquez en détail votre demande, les raisons, et ce que vous attendez...', required: true, fullWidth: true, rows: 5 },
        {
          name: 'relatedPfe',
          label: 'PFE concerné (si applicable)',
          type: 'select',
          fullWidth: true,
          options: [
            { value: '1', label: 'Application de gestion des étudiants' },
            { value: '2', label: 'Système de reconnaissance faciale' },
            { value: '3', label: 'Plateforme e-learning' }
          ]
        }
      ]
    },
    {
      title: 'Documents & Validation',
      description: 'Ajoutez des documents justificatifs',
      fields: [
        { name: 'justification', label: 'Justification', type: 'textarea', placeholder: 'Pourquoi cette demande devrait être approuvée?', fullWidth: true, rows: 3 },
        { name: 'documentReference', label: 'Référence document (optionnel)', placeholder: 'Ex: Certificat médical, attestation...', fullWidth: true },
        { name: 'deadline', label: 'Date limite souhaitée', type: 'date', hint: 'Quand avez-vous besoin d\'une réponse?' },
        { name: 'urgent', type: 'checkbox', checkboxLabel: 'Demande urgente', fullWidth: true },
        { name: 'notifyEmail', type: 'checkbox', checkboxLabel: 'Me notifier par email des mises à jour', fullWidth: true }
      ]
    }
  ];

  const handleSubmit = (formData) => {
    console.log('New Demande:', formData);
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
          title="Nouvelle Demande"
          subtitle="Soumettez une demande pour traitement"
          submitLabel="Soumettre la demande"
        />
      </div>
    </div>
  );
};

export default AddDemandeForm;
