import React from 'react';
import { Link } from 'react-router-dom';
import { Frown, Home } from 'lucide-react';
import './PageNotFound.css';

const PageNotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <div className="not-found__icon">
          <Frown size={80} strokeWidth={1.5} />
        </div>
        <h1 className="not-found__title">404</h1>
        <h2 className="not-found__subtitle">Page non trouvée</h2>
        <p className="not-found__description">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="not-found__button">
          <Home size={20} />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
