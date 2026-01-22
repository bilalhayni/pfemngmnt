/**
 * Navigation configuration for the sidebar menu
 * Each section contains menu items with path, label, and icon identifier
 */

export const navigationConfig = {
  principal: [
    { path: '/', label: "Page d'accueil", icon: 'home' }
  ],
  listes: [
    { path: '/professeurs', label: 'Professeurs-es', icon: 'professors' },
    { path: '/etudiants', label: 'Étudiants-es', icon: 'students' },
    { path: '/mes-pfes', label: "Mes PFE's", icon: 'folder' },
    { path: '/tous-les-pfes', label: "Tous les PFE's", icon: 'all-projects' },
    { path: '/pfes-etudiants', label: "PFE's et étds-es", icon: 'project-students' }
  ],
  utile: [
    { path: '/demandes', label: 'Demandes', icon: 'requests' },
    { path: '/domaines', label: 'Domaines PFE', icon: 'domains' }
  ]
};

/**
 * Navigation configuration for professor role
 */
export const professorNavigationConfig = {
  principal: [
    { path: '/prof/home', label: "Page d'accueil", icon: 'home' }
  ],
  listes: [
    { path: '/prof/student', label: 'Étudiants-es', icon: 'students' },
    { path: '/prof/pfe', label: "Mes PFE's", icon: 'folder' }
  ],
  utile: [
    { path: '/prof/demandes', label: 'Demandes', icon: 'requests' },
    { path: '/prof/domaine', label: 'Domaines PFE', icon: 'domains' }
  ]
};

/**
 * Navigation configuration for admin role
 */
export const adminNavigationConfig = {
  principal: [
    { path: '/admin/home', label: "Dashboard", icon: 'home' }
  ],
  listes: [
    { path: '/admin/pending-students', label: 'Demandes d\'activation', icon: 'requests' },
    { path: '/admin/activated-students', label: 'Étudiants actifs', icon: 'students' },
    { path: '/admin/professors', label: 'Professeurs', icon: 'professors' },
    { path: '/admin/chef-departement', label: 'Chefs Département', icon: 'professors' }
  ],
  utile: [
    { path: '/admin/create-account', label: 'Créer un compte', icon: 'add' },
    { path: '/admin/create-filiere', label: 'Gestion filières', icon: 'domains' }
  ]
};

/**
 * Navigation configuration for student role
 */
export const studentNavigationConfig = {
  principal: [
    { path: '/student/home', label: "Page d'accueil", icon: 'home' }
  ],
  listes: [
    { path: '/student/pfe', label: "Tous les PFE's", icon: 'all-projects' },
    { path: '/student/mypfe', label: "Mon PFE", icon: 'folder' }
  ],
  utile: []
};

/**
 * Get navigation config based on user role
 * @param {number} role - User role (0: Prof, 1: Chef, 2: Student, 3: Admin)
 * @returns {Object} Navigation configuration for the role
 */
export const getNavigationByRole = (role) => {
  switch (role) {
    case 0: return professorNavigationConfig;
    case 1: return navigationConfig;
    case 2: return studentNavigationConfig;
    case 3: return adminNavigationConfig;
    default: return navigationConfig;
  }
};

export default navigationConfig;
