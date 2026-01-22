/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status, code = null, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }

  static fromResponse(error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Une erreur est survenue';
    const code = error.response?.data?.code || null;
    const data = error.response?.data || null;

    return new ApiError(message, status, code, data);
  }

  isUnauthorized() {
    return this.status === 401;
  }

  isForbidden() {
    return this.status === 403;
  }

  isNotFound() {
    return this.status === 404;
  }

  isValidationError() {
    return this.status === 400 || this.status === 422;
  }

  isServerError() {
    return this.status >= 500;
  }
}

/**
 * Error messages in French for common scenarios
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
  FORBIDDEN: "Vous n'avez pas les permissions nécessaires.",
  NOT_FOUND: 'Ressource non trouvée.',
  VALIDATION_ERROR: 'Données invalides. Vérifiez les champs du formulaire.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  UNKNOWN_ERROR: 'Une erreur inattendue est survenue.'
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.UNKNOWN_ERROR;

  // Network error (no response)
  if (!error.response && error.message === 'Network Error') {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // API error with message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Status-based messages
  const status = error.response?.status;
  switch (status) {
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 400:
    case 422:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    default:
      if (status >= 500) return ERROR_MESSAGES.SERVER_ERROR;
      return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

/**
 * Handle error and return standardized response
 */
export const handleError = (error) => {
  const apiError = error instanceof ApiError ? error : ApiError.fromResponse(error);
  const message = getErrorMessage(error);

  return {
    success: false,
    error: apiError,
    message
  };
};
