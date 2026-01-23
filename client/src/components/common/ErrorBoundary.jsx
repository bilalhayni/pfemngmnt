import React from 'react';
import { AlertCircle } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // if (process.env.REACT_APP_ENABLE_ERROR_TRACKING === 'true') {
    //   logErrorToService(error, errorInfo);
    // }

    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__icon">
              <AlertCircle size={64} />
            </div>

            <h1 className="error-boundary__title">
              Oups! Quelque chose s'est mal passé
            </h1>

            <p className="error-boundary__message">
              Nous sommes désolés, mais une erreur inattendue s'est produite.
              L'équipe technique a été notifiée.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary__details">
                <summary className="error-boundary__details-summary">
                  Détails de l'erreur (dev only)
                </summary>
                <div className="error-boundary__details-content">
                  <p className="error-boundary__error-name">
                    <strong>{this.state.error.toString()}</strong>
                  </p>
                  <pre className="error-boundary__stack">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="error-boundary__actions">
              <button
                onClick={this.handleReload}
                className="error-boundary__button error-boundary__button--primary"
              >
                Recharger la page
              </button>
              <button
                onClick={this.handleReset}
                className="error-boundary__button error-boundary__button--secondary"
              >
                Retour à l'accueil
              </button>
            </div>

            <p className="error-boundary__help">
              Si le problème persiste, veuillez contacter le support technique.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
