import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

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

      if (authToken && userRole) {
        try {
          const response = await api.get('/verify-token');
          if (response.data.valid) {
            setUser({
              id: userId,
              role: parseInt(userRole),
              token: authToken,
              ...response.data.user
            });
          } else {
            logout();
          }
        } catch (error) {
          setUser({
            id: userId,
            role: parseInt(userRole),
            token: authToken
          });
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });

      if (response.data && !response.data.message) {
        const userData = response.data[0];

        if (userData.role === ROLES.STUDENT && userData.valid === 0) {
          return {
            success: false,
            error: "Votre compte n'a pas été activé! Veuillez attendre que l'administrateur active votre compte"
          };
        }

        Cookies.set('auth', 'true', { expires: 7 });
        Cookies.set('role', userData.role.toString(), { expires: 7 });
        Cookies.set('userId', userData.id?.toString() || userData.idProfesseur?.toString() || userData.idEtudiant?.toString(), { expires: 7 });

        setUser({
          id: userData.id || userData.idProfesseur || userData.idEtudiant,
          role: userData.role,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
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
      const response = await api.post('/registerStudent', userData);

      if (response.data.message) {
        return { success: false, error: response.data.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Une erreur est survenue lors de l'inscription"
      };
    }
  };

  const logout = () => {
    Cookies.remove('auth');
    Cookies.remove('role');
    Cookies.remove('userId');
    setUser(null);
  };

  const resetPassword = async (email) => {
    try {
      await api.post('/reset-password-email', { email });
      return { success: true };
    } catch (error) {
      return { success: false, error: "Erreur lors de l'envoi du mot de passe" };
    }
  };

  const isAuthenticated = () => !!user && !!Cookies.get('auth');
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
      user, loading, login, logout, register, resetPassword,
      isAuthenticated, hasRole, getRedirectPath, ROLES
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
