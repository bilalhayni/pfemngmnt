import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MultiStepForm from './MultiStepForm';
import filiereService from '../../services/api/filiere.service';
import './SignUpForm.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  // Optional: show server error message in the form (instead of popup)
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchDepartments = async () => {
      try {
        const response = await filiereService.getAll();
        if (!isMounted) return;

        if (response?.data) {
          const options = response.data.map((dep) => ({
            value: dep.idFiliere?.toString?.() ?? String(dep.idFiliere),
            label: dep.name
          }));
          setDepartments(options);
        } else {
          setDepartments([]);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        if (isMounted) setDepartments([]);
      } finally {
        if (isMounted) setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
    return () => {
      isMounted = false;
    };
  }, []);

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const steps = useMemo(
    () => [
      {
        fields: [
          { name: 'firstName', label: 'Prénom', placeholder: 'Entrez votre prénom', required: true, autoComplete: 'given-name' },
          { name: 'lastName', label: 'Nom', placeholder: 'Entrez votre nom', required: true, autoComplete: 'family-name' },
          { name: 'email', label: 'Adresse e-mail', type: 'email', placeholder: 'exemple@email.com', required: true, fullWidth: true, autoComplete: 'email' },
          { name: 'phone', label: 'Téléphone', type: 'tel', placeholder: '+212 6XX XXX XXX', autoComplete: 'tel' }
        ]
      },
      {
        fields: [
          {
            name: 'dateNaissance',
            label: 'Date de naissance',
            type: 'date',
            required: true,
            max: todayIso
          },
          {
            name: 'department',
            label: 'Département',
            type: 'select',
            required: true,
            placeholder: isLoadingDepartments ? 'Chargement...' : 'Sélectionner un département',
            options: departments,
            disabled: isLoadingDepartments
          },
          { name: 'cne', label: 'CNE', placeholder: 'Votre CNE', required: true },
          { name: 'cin', label: 'CIN', placeholder: 'Votre CIN', required: true }
        ]
      },
      {
        fields: [
          {
            name: 'password',
            label: 'Mot de passe',
            type: 'password',
            placeholder: '••••••••',
            required: true,
            hint: 'Minimum 8 caractères',
            autoComplete: 'new-password'
          },
          {
            name: 'confirmPassword',
            label: 'Confirmer le mot de passe',
            type: 'password',
            placeholder: '••••••••',
            required: true,
            autoComplete: 'new-password'
          },
        
        ]
      }
    ],
    [departments, isLoadingDepartments, todayIso]
  );

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
