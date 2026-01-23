/**
 * Navigation configuration for the sidebar menu
 * Each section contains menu items with path, label, and icon identifier
 */

export const navigationConfig = {
  principal: [
    { path: '/', label: 'Accueil', icon: 'home' }
  ],
  listes: [
    { path: '/professeurs', label: 'Professeurs', icon: 'professors' },
    { path: '/etudiants', label: 'Étudiants', icon: 'students' },
    { path: '/mes-pfes', label: 'Mes PFEs', icon: 'folder' },
    { path: '/tous-les-pfes', label: 'Tous les PFEs', icon: 'all-projects' },
    { path: '/pfes-etudiants', label: 'PFEs et étudiants', icon: 'project-students' }
  ],
  utile: [
    { path: '/demandes', label: 'Demandes', icon: 'requests' },
    { path: '/domaines', label: 'Domaines de PFE', icon: 'domains' }
  ]
};

/**
 * Navigation configuration for professor role
 */
export const professorNavigationConfig = {
  principal: [
    { path: '/prof/home', label: 'Tableau de bord', icon: 'home' }
  ],
  listes: [
    { path: '/prof/pfe', label: 'Mes PFEs', icon: 'folder' },
    { path: '/prof/demandes', label: 'Demandes', icon: 'requests' },
    { path: '/prof/students', label: 'Mes étudiants', icon: 'students' }
  ],
  utile: [
    { path: '/prof/pfe/new', label: 'Créer un PFE', icon: 'add' },
    { path: '/prof/profile', label: 'Mon profil', icon: 'students' }
  ]
};

/**
 * Navigation configuration for admin role
 */
export const adminNavigationConfig = {
  principal: [
    { path: '/admin/home', label: 'Tableau de bord', icon: 'home' }
  ],
  listes: [
    { path: '/admin/pending-students', label: "Demandes d’activation", icon: 'requests' },
    { path: '/admin/activated-students', label: 'Étudiants actifs', icon: 'students' },
    { path: '/admin/professors', label: 'Professeurs', icon: 'professors' },
    { path: '/admin/chef-departement', label: 'Chefs de département', icon: 'professors' }
  ],
  utile: [
    { path: '/admin/create-account', label: 'Créer un compte', icon: 'add' },
    { path: '/admin/create-filiere', label: 'Gestion des filières', icon: 'domains' }
  ]
};

/**
 * Navigation configuration for student role
 */
export const studentNavigationConfig = {
  principal: [
    { path: '/student/home', label: 'Tableau de bord', icon: 'home' }
  ],
  listes: [
    { path: '/student/pfe', label: 'Parcourir les PFEs', icon: 'all-projects' },
    { path: '/student/applications', label: 'Mes candidatures', icon: 'requests' },
    { path: '/student/mypfe', label: 'Mon PFE', icon: 'folder' }
  ],
  utile: [
    { path: '/student/profile', label: 'Mon profil', icon: 'students' }
  ]
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
