import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, resetPassword, ROLES } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }
    if (!password) {
      newErrors.password = 'Mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Mot de passe doit contenir au moins 6 caractères';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const result = await login(email, password);

    setIsLoading(false);

    if (result.success) {
      // Navigate based on role
      switch (result.role) {
        case ROLES.PROFESSOR:
          navigate('/prof/home');
          break;
        case ROLES.CHEF_DEPARTEMENT:
          navigate('/');
          break;
        case ROLES.STUDENT:
          navigate('/student/home');
          break;
        case ROLES.ADMIN:
          navigate('/admin/home');
          break;
        default:
          navigate('/');
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: result.error,
        confirmButtonColor: '#4f6bed'
      });
    }
  };

  const handleForgotPassword = async () => {
    const { value: emailInput } = await Swal.fire({
      title: 'Mot de passe oublié?',
      input: 'email',
      inputLabel: 'Entrez votre adresse email',
      inputPlaceholder: 'exemple@email.com',
      showCancelButton: true,
      confirmButtonText: 'Envoyer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#4f6bed',
      inputValidator: (value) => {
        if (!value) {
          return 'Veuillez entrer votre email';
        }
        if (!/\S+@\S+\.\S+/.test(value)) {
          return 'Email invalide';
        }
      }
    });

    if (emailInput) {
      const result = await resetPassword(emailInput);
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Email envoyé',
          text: `Le mot de passe a été envoyé à: ${emailInput}`,
          confirmButtonColor: '#4f6bed'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: result.error,
          confirmButtonColor: '#4f6bed'
        });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="8" height="8" rx="2" />
              <rect x="13" y="3" width="8" height="8" rx="2" />
              <rect x="3" y="13" width="8" height="8" rx="2" />
              <rect x="13" y="13" width="8" height="8" rx="2" />
            </svg>
          </div>
          <span className="login-logo-text">PFE Manager</span>
        </div>

        <h1 className="login-title">Se connecter</h1>
        <p className="login-subtitle">Bienvenue! Veuillez vous connecter pour continuer</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={errors.email ? 'true' : 'false'}
              autoComplete="email"
            />
            {errors.email && <span id="email-error" className="form-error" role="alert">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Mot de passe</label>
            <input
              id="login-password"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${errors.password ? 'form-input--error' : ''}`}
              aria-describedby={errors.password ? 'password-error' : undefined}
              aria-invalid={errors.password ? 'true' : 'false'}
              autoComplete="current-password"
            />
            {errors.password && <span id="password-error" className="form-error" role="alert">{errors.password}</span>}
          </div>

          <div className="form-options">
            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPassword}
            >
              Mot de passe oublié?
            </button>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-button__loading">
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>

        <div className="login-footer">
          <span>Pas encore inscrit?</span>
          <Link to="/signup" className="signup-link">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
