import React from 'react';
import MultiStepForm from './MultiStepForm';
import './AddForms.css';

const AddDomainForm = ({ onSubmit, onCancel }) => {
  const steps = [
    {
      title: 'Informations du domaine',
      description: 'Définissez le nouveau domaine PFE',
      fields: [
        { name: 'name', label: 'Nom du domaine', placeholder: 'Ex: Intelligence Artificielle', required: true, fullWidth: true },
        { name: 'shortName', label: 'Abréviation', placeholder: 'Ex: IA', required: true, hint: 'Code court pour le domaine' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Décrivez ce domaine et les types de projets associés...', required: true, fullWidth: true, rows: 4 },
        {
          name: 'color',
          label: 'Couleur',
          type: 'select',
          required: true,
          options: [
            { value: '#4f6bed', label: 'Bleu' },
            { value: '#22c55e', label: 'Vert' },
            { value: '#f59e0b', label: 'Orange' },
            { value: '#8b5cf6', label: 'Violet' },
            { value: '#ef4444', label: 'Rouge' },
            { value: '#06b6d4', label: 'Cyan' },
            { value: '#ec4899', label: 'Rose' }
          ]
        }
      ]
    },
    {
      title: 'Encadrants & Capacité',
      description: 'Assignez les professeurs responsables',
      fields: [
        {
          name: 'responsable',
          label: 'Responsable du domaine',
          type: 'select',
          required: true,
          options: [
            { value: '1', label: 'Dr. Ahmed Benali' },
            { value: '2', label: 'Dr. Fatima Zahra' },
            { value: '3', label: 'Dr. Mohammed Alaoui' }
          ]
        },
        { name: 'maxPfes', label: 'Nombre max de PFEs par année', type: 'number', placeholder: '20', required: true, hint: 'Capacité annuelle du domaine' },
        { name: 'keywords', label: 'Mots-clés', placeholder: 'machine learning, deep learning, NLP...', fullWidth: true, hint: 'Séparez par des virgules' },
        {
          name: 'niveau',
          label: 'Niveau requis',
          type: 'select',
          options: [
            { value: 'all', label: 'Tous niveaux' },
            { value: 'licence', label: 'Licence uniquement' },
            { value: 'master', label: 'Master uniquement' }
          ]
        }
      ]
    },
    {
      title: 'Technologies & Ressources',
      description: 'Spécifiez les technologies et ressources',
      fields: [
        { name: 'technologies', label: 'Technologies principales', type: 'textarea', placeholder: 'Python, TensorFlow, PyTorch, Jupyter...', fullWidth: true, rows: 2, hint: 'Technologies couramment utilisées' },
        { name: 'prerequisites', label: 'Prérequis', type: 'textarea', placeholder: 'Connaissances en programmation Python, statistiques...', fullWidth: true, rows: 2 },
        { name: 'resources', label: 'Ressources disponibles', type: 'textarea', placeholder: 'GPU serveur, datasets, licences logicielles...', fullWidth: true, rows: 2 },
        { name: 'isActive', type: 'checkbox', checkboxLabel: 'Domaine actif (accepte les nouveaux PFEs)', fullWidth: true },
        { name: 'featured', type: 'checkbox', checkboxLabel: 'Mettre en avant sur la page d\'accueil', fullWidth: true }
      ]
    }
  ];

  const handleSubmit = (formData) => {
    console.log('New Domain:', formData);
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
          title="Nouveau Domaine"
          subtitle="Créez un nouveau domaine de spécialité PFE"
          submitLabel="Créer le domaine"
        />
      </div>
    </div>
  );
};

export default AddDomainForm;
