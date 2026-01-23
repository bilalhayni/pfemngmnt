import React, { useState, useMemo } from 'react';
import './MultiStepForm.css';
import { Link, useNavigate } from 'react-router-dom';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MultiStepForm = ({
  steps,
  onSubmit,
  submitLabel = 'Soumettre',
  title,
  subtitle,
  isSubmitting = false,
  serverError = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [direction, setDirection] = useState('next');
  const [errors, setErrors] = useState({}); // { fieldName: "message" }

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const setFieldValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear field error on edit
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFieldValue(name, type === 'checkbox' ? checked : value);
  };

  const validateStep = (stepIndex, data) => {
    const step = steps[stepIndex];
    const newErrors = {};

    for (const field of step.fields) {
      const val = data[field.name];

      if (field.required) {
        if (field.type === 'checkbox') {
          if (val !== true) newErrors[field.name] = 'Ce champ est obligatoire.';
        } else if (val === undefined || val === null || String(val).trim() === '') {
          newErrors[field.name] = 'Ce champ est obligatoire.';
        }
      }

      // Extra validations
      if (field.type === 'email' && val) {
        if (!emailRegex.test(String(val).trim())) {
          newErrors[field.name] = "Adresse e-mail invalide.";
        }
      }

      if (field.type === 'date' && val) {
        // prevent future birth date
        if (String(val) > (field.max || todayIso)) {
          newErrors[field.name] = "La date de naissance ne peut pas être dans le futur.";
        }
      }
    }

    // Password match (only if both exist in this step)
    const hasPassword = step.fields.some((f) => f.name === 'password');
    const hasConfirm = step.fields.some((f) => f.name === 'confirmPassword');
    if (hasPassword && hasConfirm) {
      const p = data.password || '';
      const c = data.confirmPassword || '';
      if (p && c && p !== c) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
      }
    }

    return newErrors;
  };

  const goToStep = (nextIndex) => {
    setDirection(nextIndex > currentStep ? 'next' : 'prev');
    setCurrentStep(nextIndex);
  };

  const handleNext = () => {
    if (currentStep >= steps.length - 1) return;

    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    goToStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep <= 0) return;
    setErrors({});
    goToStep(currentStep - 1);
  };

  const validateAllAndJump = () => {
    for (let i = 0; i < steps.length; i++) {
      const stepErrors = validateStep(i, formData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        goToStep(i);
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAllAndJump()) return;
    onSubmit(formData);
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="multistep-form">
      <div className="signup-logo">
        <img src="/logo-fpn.svg" alt="Faculté Pluridisciplinaire de Nador" />
      </div>

      {title && (
        <div className="multistep-form__header">
          <h2 className="multistep-form__title">{title}</h2>
          {subtitle && <p className="multistep-form__subtitle">{subtitle}</p>}
        </div>
      )}

      {/* Server error (no popup) */}
      {serverError ? (
        <div className="multistep-form__server-error" role="alert">
          {serverError}
        </div>
      ) : null}    
      {/* Form Content */}
      <form onSubmit={handleSubmit} className="multistep-form__content" noValidate>
        <div className="multistep-form__slides">
          <div className={`multistep-form__slide multistep-form__slide--${direction}`} key={currentStep}>
            <h3 className="multistep-form__step-title">{steps[currentStep].title}</h3>

            {steps[currentStep].description && (
              <p className="multistep-form__step-description">{steps[currentStep].description}</p>
            )}

            <div className="multistep-form__fields">
              {steps[currentStep].fields.map((field) => {
                const fieldId = `field-${field.name}`;
                const hintId = field.hint ? `hint-${field.name}` : undefined;
                const errorMsg = errors[field.name];

                return (
                  <div key={field.name} className={`form-field ${field.fullWidth ? 'form-field--full' : ''}`}>
                    {field.type !== 'checkbox' && (
                      <label htmlFor={fieldId} className="form-field__label">
                        {field.label}
                        {field.required && <span className="form-field__required">*</span>}
                      </label>
                    )}

                    {field.type === 'select' ? (
                      <select
                        id={fieldId}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="form-field__select"
                        required={field.required}
                        aria-describedby={hintId}
                        aria-invalid={!!errorMsg}
                        disabled={field.disabled}
                      >
                        <option value="">{field.placeholder || 'Sélectionner...'}</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        id={fieldId}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="form-field__textarea"
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={field.rows || 4}
                        aria-describedby={hintId}
                        aria-invalid={!!errorMsg}
                      />
                    ) : field.type === 'checkbox' ? (
                      <label htmlFor={fieldId} className="form-field__checkbox">
                        <input
                          id={fieldId}
                          type="checkbox"
                          name={field.name}
                          checked={formData[field.name] || false}
                          onChange={handleChange}
                          aria-describedby={hintId}
                          aria-invalid={!!errorMsg}
                        />
                        <span className="form-field__checkbox-label">{field.checkboxLabel}</span>
                      </label>
                    ) : (
                      <input
                        id={fieldId}
                        type={field.type || 'text'}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="form-field__input"
                        placeholder={field.placeholder}
                        required={field.required}
                        aria-describedby={hintId}
                        aria-invalid={!!errorMsg}
                        autoComplete={field.autoComplete}
                        max={field.type === 'date' ? field.max : undefined}
                      />
                    )}

                    {field.hint && <span id={hintId} className="form-field__hint">{field.hint}</span>}
                    {errorMsg && <span className="form-field__error">{errorMsg}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="multistep-form__actions">
          <button
            type="button"
            className="multistep-form__btn multistep-form__btn--prev"
            onClick={handlePrev}
            disabled={isFirstStep}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Précédent
          </button>

          {isLastStep ? (
            <button
              type="submit"
              className="multistep-form__btn multistep-form__btn--submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                  Chargement...
                </>
              ) : (
                <>
                  {submitLabel}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </>
              )}
            </button>
          ) : (
            <button type="button" className="multistep-form__btn multistep-form__btn--next" onClick={handleNext}>
              Suivant
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

      </form>
              <div className="signup-footer">
          <span>Déjà inscrit ?</span>
          <Link to="/login" className="login-link">Se connecter</Link>
        </div>
    </div>
  );
};

export default MultiStepForm;
