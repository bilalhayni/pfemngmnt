import React from 'react';
import PropTypes from 'prop-types';
import './Loading.css';

/**
 * Loading component for displaying loading states
 * @param {string} size - Size of the spinner (sm, md, lg)
 * @param {string} message - Optional loading message to display
 * @param {boolean} fullPage - Whether to display as full page overlay
 */
const Loading = ({ size = 'md', message = '', fullPage = false }) => {
  const content = (
    <div className={`loading ${fullPage ? 'loading--fullpage' : ''}`}>
      <div className={`loading__spinner loading__spinner--${size}`} role="status" aria-live="polite">
        <svg className="loading__svg" viewBox="0 0 50 50">
          <circle
            className="loading__circle"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
          />
        </svg>
      </div>
      {message && (
        <p className="loading__message">
          {message}
        </p>
      )}
      <span className="sr-only">Chargement en cours...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="loading__overlay">
        {content}
      </div>
    );
  }

  return content;
};

Loading.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  message: PropTypes.string,
  fullPage: PropTypes.bool
};

export default Loading;
