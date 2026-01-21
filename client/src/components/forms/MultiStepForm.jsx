import React, { useState } from 'react';
import './MultiStepForm.css';

const MultiStepForm = ({
  steps,
  onSubmit,
  submitLabel = "Soumettre",
  title,
  subtitle,
  isSubmitting = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [direction, setDirection] = useState('next');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection('next');
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection('prev');
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="multistep-form">
      {title && (
        <div className="multistep-form__header">
          <h2 className="multistep-form__title">{title}</h2>
          {subtitle && <p className="multistep-form__subtitle">{subtitle}</p>}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="multistep-form__progress">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`progress-step ${index === currentStep ? 'progress-step--active' : ''} ${index < currentStep ? 'progress-step--completed' : ''}`}
          >
            <div className="progress-step__circle">
              {index < currentStep ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className="progress-step__label">{step.title}</span>
            {index < steps.length - 1 && <div className="progress-step__line" />}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="multistep-form__content">
        <div className="multistep-form__slides">
          <div
            className={`multistep-form__slide multistep-form__slide--${direction}`}
            key={currentStep}
          >
            <h3 className="multistep-form__step-title">{steps[currentStep].title}</h3>
            {steps[currentStep].description && (
              <p className="multistep-form__step-description">{steps[currentStep].description}</p>
            )}

            <div className="multistep-form__fields">
              {steps[currentStep].fields.map((field) => {
                const fieldId = `field-${field.name}`;
                const hintId = field.hint ? `hint-${field.name}` : undefined;

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
                      >
                        <option value="">{field.placeholder || 'Sélectionner...'}</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                        autoComplete={field.type === 'email' ? 'email' : field.type === 'password' ? 'new-password' : undefined}
                      />
                    )}

                    {field.hint && <span id={hintId} className="form-field__hint">{field.hint}</span>}
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
            <button
              type="button"
              className="multistep-form__btn multistep-form__btn--next"
              onClick={handleNext}
            >
              Suivant
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
