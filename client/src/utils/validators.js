// Email validation
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Phone validation (Moroccan format)
export const isValidPhone = (phone) => {
  const regex = /^(\+212|0)[5-7]\d{8}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

// Password validation (min 6 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Required field validation
export const isRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
};

// Min length validation
export const minLength = (value, min) => {
  return value && value.length >= min;
};

// Max length validation
export const maxLength = (value, max) => {
  return !value || value.length <= max;
};

// Number range validation
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

// Date validation
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

// URL validation
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];

    fieldRules.forEach((rule) => {
      if (errors[field]) return;

      if (rule.required && !isRequired(value)) {
        errors[field] = rule.message || 'Ce champ est requis';
      } else if (rule.email && value && !isValidEmail(value)) {
        errors[field] = rule.message || 'Email invalide';
      } else if (rule.phone && value && !isValidPhone(value)) {
        errors[field] = rule.message || 'Numéro de téléphone invalide';
      } else if (rule.minLength && value && !minLength(value, rule.minLength)) {
        errors[field] = rule.message || 'Minimum ' + rule.minLength + ' caractères';
      } else if (rule.maxLength && value && !maxLength(value, rule.maxLength)) {
        errors[field] = rule.message || 'Maximum ' + rule.maxLength + ' caractères';
      }
    });
  });

  return errors;
};
