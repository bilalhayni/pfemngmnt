import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // User roles
  const ROLES = {
    PROFESSOR: 0,
    CHEF_DEPARTEMENT: 1,
    STUDENT: 2,
    ADMIN: 3
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const authToken = Cookies.get('auth');
      const userRole = Cookies.get('role');
      const userId = Cookies.get('userId');
      const filId = Cookies.get('filId');

      // Only proceed if we have a JWT token (not just 'true')
      if (authToken && authToken !== 'true' && userRole) {
        try {
          // Verify token with server
          const response = await authService.verifyToken();
          if (response.data.valid) {
            setUser({
              id: parseInt(userId),
              role: parseInt(userRole),
              idFiliere: filId ? parseInt(filId) : null,
              token: authToken,
              ...response.data.user
            });
          } else {
            // Token invalid, clear everything
            clearAuth();
          }
        } catch (error) {
          // If verification fails but we have cookies, set basic user data
          // The API interceptor will handle 401 errors
          if (error.response?.status === 401) {
            clearAuth();
          } else {
            setUser({
              id: parseInt(userId),
              role: parseInt(userRole),
              idFiliere: filId ? parseInt(filId) : null,
              token: authToken
            });
          }
        }
      } else if (authToken === 'true' && userRole) {
        // Legacy auth (before JWT), clear and require re-login
        clearAuth();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const clearAuth = () => {
    Cookies.remove('auth');
    Cookies.remove('role');
    Cookies.remove('userId');
    Cookies.remove('filId');
    setUser(null);
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      if (response.data && !response.data.message) {
        // Handle both array and object response formats
        const userData = Array.isArray(response.data) ? response.data[0] : response.data;

        if (userData.role === ROLES.STUDENT && userData.valid === 0) {
          return {
            success: false,
            error: "Votre compte n'a pas été activé! Veuillez attendre que l'administrateur active votre compte"
          };
        }

        // Store JWT token (from server response)
        const token = userData.token;
        if (!token) {
          return {
            success: false,
            error: 'Erreur d\'authentification: token non reçu'
          };
        }

        // Set cookies with JWT token and security options
        const cookieOptions = {
          expires: 1, // 1 day expiry
          secure: process.env.REACT_APP_COOKIE_SECURE === 'true', // Use secure cookies in production (HTTPS)
          sameSite: process.env.REACT_APP_COOKIE_SAME_SITE || 'lax' // CSRF protection
        };

        Cookies.set('auth', token, cookieOptions);
        Cookies.set('role', userData.role.toString(), cookieOptions);
        Cookies.set('userId', (userData.id || userData.idProfesseur || userData.idEtudiant)?.toString(), cookieOptions);
        Cookies.set('filId', userData.idFiliere?.toString() || '', cookieOptions);

        setUser({
          id: userData.id || userData.idProfesseur || userData.idEtudiant,
          role: userData.role,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          idFiliere: userData.idFiliere,
          token: token,
          ...userData
        });

        return { success: true, role: userData.role };
      }

      return {
        success: false,
        error: 'Mauvaise combinaison email/mot de passe!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Une erreur est survenue'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response.data.message === 'The Email already exists') {
        return { success: false, error: 'Cet email existe déjà' };
      }

      if (response.data.userId) {
        return { success: true };
      }

      return { success: false, error: response.data.message || 'Erreur d\'inscription' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Une erreur est survenue lors de l'inscription"
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore logout errors
    }
    clearAuth();
  };

  const resetPassword = async (email) => {
    try {
      await authService.resetPassword(email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erreur lors de l'envoi du mot de passe"
      };
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      if (response.data.token) {
        const cookieOptions = {
          expires: 1,
          secure: process.env.REACT_APP_COOKIE_SECURE === 'true',
          sameSite: process.env.REACT_APP_COOKIE_SAME_SITE || 'lax'
        };
        Cookies.set('auth', response.data.token, cookieOptions);
        setUser(prev => ({ ...prev, token: response.data.token }));
        return true;
      }
      return false;
    } catch (error) {
      clearAuth();
      return false;
    }
  };

  const isAuthenticated = () => {
    const token = Cookies.get('auth');
    return !!user && !!token && token !== 'true';
  };

  const hasRole = (role) => user?.role === role;

  const getRedirectPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case ROLES.PROFESSOR: return '/prof/home';
      case ROLES.CHEF_DEPARTEMENT: return '/';
      case ROLES.STUDENT: return '/student/home';
      case ROLES.ADMIN: return '/admin/home';
      default: return '/login';
    }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, register, resetPassword, refreshToken,
      isAuthenticated, hasRole, getRedirectPath, ROLES
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
