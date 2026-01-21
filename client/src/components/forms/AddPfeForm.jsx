import React from 'react';
import MultiStepForm from './MultiStepForm';
import './AddForms.css';

const AddPfeForm = ({ onSubmit, onCancel }) => {
  const steps = [
    {
      title: 'Informations générales',
      description: 'Définissez les informations de base du PFE',
      fields: [
        { name: 'title', label: 'Titre du PFE', placeholder: 'Ex: Application de gestion...', required: true, fullWidth: true },
        {
          name: 'domain',
          label: 'Domaine',
          type: 'select',
          required: true,
          options: [
            { value: 'web', label: 'Développement Web' },
            { value: 'ai', label: 'Intelligence Artificielle' },
            { value: 'mobile', label: 'Mobile' },
            { value: 'data', label: 'Data Science' },
            { value: 'security', label: 'Réseaux & Sécurité' }
          ]
        },
        {
          name: 'type',
          label: 'Type de projet',
          type: 'select',
          required: true,
          options: [
            { value: 'application', label: 'Application' },
            { value: 'research', label: 'Recherche' },
            { value: 'study', label: 'Étude' },
            { value: 'prototype', label: 'Prototype' }
          ]
        },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Décrivez le projet en détail...', required: true, fullWidth: true, rows: 4 }
      ]
    },
    {
      title: 'Encadrement',
      description: 'Assignez les encadrants et étudiants',
      fields: [
        {
          name: 'supervisor',
          label: 'Encadrant principal',
          type: 'select',
          required: true,
          options: [
            { value: '1', label: 'Dr. Ahmed Benali' },
            { value: '2', label: 'Dr. Fatima Zahra' },
            { value: '3', label: 'Dr. Mohammed Alaoui' }
          ]
        },
        {
          name: 'coSupervisor',
          label: 'Co-encadrant (optionnel)',
          type: 'select',
          options: [
            { value: '1', label: 'Dr. Ahmed Benali' },
            { value: '2', label: 'Dr. Fatima Zahra' },
            { value: '3', label: 'Dr. Mohammed Alaoui' }
          ]
        },
        {
          name: 'student1',
          label: 'Étudiant 1',
          type: 'select',
          required: true,
          options: [
            { value: '1', label: 'Youssef El Amrani' },
            { value: '2', label: 'Sara Benjelloun' },
            { value: '3', label: 'Omar Tazi' }
          ]
        },
        {
          name: 'student2',
          label: 'Étudiant 2 (binôme)',
          type: 'select',
          options: [
            { value: '1', label: 'Youssef El Amrani' },
            { value: '2', label: 'Sara Benjelloun' },
            { value: '3', label: 'Omar Tazi' }
          ]
        }
      ]
    },
    {
      title: 'Planification',
      description: 'Définissez les dates et objectifs',
      fields: [
        { name: 'startDate', label: 'Date de début', type: 'date', required: true },
        { name: 'endDate', label: 'Date de fin prévue', type: 'date', required: true },
        { name: 'objectives', label: 'Objectifs principaux', type: 'textarea', placeholder: 'Listez les objectifs du projet...', fullWidth: true, rows: 3 },
        { name: 'technologies', label: 'Technologies utilisées', placeholder: 'Ex: React, Node.js, MongoDB...', fullWidth: true, hint: 'Séparez par des virgules' }
      ]
    }
  ];

  const handleSubmit = (formData) => {
    console.log('New PFE:', formData);
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
          title="Nouveau PFE"
          subtitle="Créez un nouveau projet de fin d'études"
          submitLabel="Créer le PFE"
        />
      </div>
    </div>
  );
};

export default AddPfeForm;
