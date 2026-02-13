import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import filiereService from '../../services/api/filiere.service';
import Swal from 'sweetalert2';
import MultiStepForm from './MultiStepForm';
import filiereService from '../../services/api/filiere.service';
import './SignUpForm.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await filiereService.getAll();
        const deptOptions = response.data.map(dept => ({
          value: dept.id || dept._id,
          label: dept.nom || dept.name
        }));
        setDepartments(deptOptions);
      } catch (error) {
        console.error('Erreur lors du chargement des départements:', error);
      }
    };
    fetchDepartments();
  }, []);

  const steps = [
    {
      title: 'Informations personnelles',
      description: 'Commençons par vos informations de base',
      fields: [
        { name: 'firstName', label: 'Prénom', placeholder: 'Entrez votre prénom', required: true },
        { name: 'lastName', label: 'Nom', placeholder: 'Entrez votre nom', required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'exemple@email.com', required: true, fullWidth: true },
        { name: 'phone', label: 'Téléphone', type: 'tel', placeholder: '+212 6XX XXX XXX' }
      ]
    },
    {
      title: 'Informations académiques',
      description: 'Parlez-nous de votre parcours',
      fields: [
        {
          name: 'dateNaissance',
          label: 'Date de naissance',
          type: 'date',
          required: true,
          hint: 'Format: JJ/MM/AAAA'
        },
        {
          name: 'department',
          label: 'Département',
          type: 'select',
          required: true,
          placeholder: 'Chargement...',
          options: departments
        },
        { name: 'cne', label: 'CNE', placeholder: 'Votre CNE', required: true },
        { name: 'cin', label: 'CIN', placeholder: 'Votre CIN', required: true }
      ]
    },
    {
      title: 'Sécurité du compte',
      description: 'Créez un mot de passe sécurisé',
      fields: [
        { name: 'password', label: 'Mot de passe', type: 'password', placeholder: '••••••••', required: true, hint: 'Minimum 8 caractères' },
        { name: 'confirmPassword', label: 'Confirmer le mot de passe', type: 'password', placeholder: '••••••••', required: true },
        { name: 'acceptTerms', type: 'checkbox', checkboxLabel: "J'accepte les conditions d'utilisation", fullWidth: true, required: true },
        { name: 'newsletter', type: 'checkbox', checkboxLabel: 'Recevoir les notifications par email', fullWidth: true }
      ]
    }
  ];

  const handleSubmit = async (formData) => {
    if (isSubmitting) return;

    setServerError('');

    setIsSubmitting(true);

    const registrationData = {
      firstName: formData.firstName?.trim(),
      lastName: formData.lastName?.trim(),
      email: formData.email?.trim(),
      password: formData.password,
      phone: formData.phone || '',
      cne: formData.cne || '',
      cin: formData.cin?.trim(),
      department: formData.department, // id as string
      role: 2, // Student only
      dateNaissance: formData.dateNaissance
    };

    try {
      const result = await register(registrationData);

      if (result?.success) {
        // pro UX: redirect, you can also pass state message to login page
        navigate('/login', { state: { justRegistered: true } });
      } else {
        setServerError(result?.error || "Une erreur est survenue lors de l'inscription.");
      }
    } catch (e) {
      setServerError("Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <MultiStepForm
          steps={steps}
          onSubmit={handleSubmit}
          title="Créer un compte"
          subtitle="Rejoignez la plateforme PFE Manager"
          submitLabel="S'inscrire"
          isSubmitting={isSubmitting}
          serverError={serverError}
          
        />


      </div>
    </div>
  );
};

export default SignUpForm;
