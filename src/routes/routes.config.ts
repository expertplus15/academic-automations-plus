// Configuration centralisée des routes de l'application
export interface RouteConfig {
  path: string;
  component: string;
  title: string;
  description?: string;
  icon?: string;
  children?: RouteConfig[];
  protected?: boolean;
  roles?: string[];
}

export const routesConfig: RouteConfig[] = [
  // Routes publiques
  {
    path: "/",
    component: "Index",
    title: "Accueil",
    protected: false,
  },
  {
    path: "/login",
    component: "Login", 
    title: "Connexion",
    protected: false,
  },
  {
    path: "/signup",
    component: "Signup",
    title: "Inscription", 
    protected: false,
  },
  {
    path: "/reset-password",
    component: "ResetPassword",
    title: "Réinitialisation",
    protected: false,
  },

  // Dashboard principal
  {
    path: "/dashboard",
    component: "Dashboard",
    title: "Tableau de bord",
    protected: true,
  },

  // Module Finances
  {
    path: "/finance",
    component: "Finance",
    title: "Finances",
    icon: "Euro",
    protected: true,
    children: [
      {
        path: "/finance/dashboard",
        component: "FinanceDashboard",
        title: "Tableau de bord",
      },
      {
        path: "/finance/invoices",
        component: "FinanceInvoices", 
        title: "Facturation",
      },
      {
        path: "/finance/payments",
        component: "FinancePayments",
        title: "Paiements",
      },
      {
        path: "/finance/budgets",
        component: "FinanceBudgetOverview",
        title: "Budgets",
      },
      {
        path: "/finance/reports",
        component: "FinanceReports",
        title: "Rapports",
      },
    ],
  },

  // Module Étudiants
  {
    path: "/students",
    component: "Students",
    title: "Étudiants",
    icon: "Users",
    protected: true,
    children: [
      {
        path: "/students/registration",
        component: "StudentsRegistration",
        title: "Inscriptions",
      },
      {
        path: "/students/profiles",
        component: "StudentsProfiles",
        title: "Profils",
      },
      {
        path: "/students/tracking",
        component: "StudentsTracking",
        title: "Suivi",
      },
      {
        path: "/students/cards",
        component: "StudentsCards",
        title: "Cartes étudiants",
      },
    ],
  },

  // Module Académique
  {
    path: "/academic",
    component: "Academic",
    title: "Académique",
    icon: "GraduationCap",
    protected: true,
    children: [
      {
        path: "/academic/programs",
        component: "AcademicPrograms",
        title: "Programmes",
      },
      {
        path: "/academic/subjects",
        component: "AcademicSubjects",
        title: "Matières",
      },
      {
        path: "/academic/timetables",
        component: "AcademicTimetables",
        title: "Emplois du temps",
      },
      {
        path: "/academic/calendar",
        component: "AcademicCalendar",
        title: "Calendrier",
      },
    ],
  },

  // Module Résultats et Évaluations  
  {
    path: "/results",
    component: "Results",
    title: "Résultats",
    icon: "BarChart3",
    protected: true,
    children: [
      {
        path: "/results/grading-system",
        component: "ResultsGradingSystem",
        title: "Système de Notation",
      },
      {
        path: "/results/grade-entry",
        component: "ResultsGradeEntry",
        title: "Saisie des notes",
      },
      {
        path: "/results/calculations",
        component: "ResultsCalculations",
        title: "Calculs & Moyennes",
      },
      {
        path: "/results/validation",
        component: "ResultsValidation",
        title: "Validation",
      },
      {
        path: "/results/documentation",
        component: "ResultsDocumentation",
        title: "Documentation",
        description: "Gestion des types de documents d'évaluation",
      },
      {
        path: "/results/personalisation",
        component: "ResultsPersonalisation",
        title: "Personnalisation",
      },
      {
        path: "/results/production",
        component: "ResultsProduction",
        title: "Production",
      },
      {
        path: "/results/analytics",
        component: "ResultsAnalytics",
        title: "Analyse & Contrôle",
      },
    ],
  },

  // Module Examens
  {
    path: "/exams",
    component: "Exams",
    title: "Examens",
    icon: "FileCheck",
    protected: true,
    children: [
      {
        path: "/exams/creation",
        component: "ExamCreation",
        title: "Création",
      },
      {
        path: "/exams/planning",
        component: "ExamsPlanning",
        title: "Planification",
      },
      {
        path: "/exams/monitoring",
        component: "ExamsMonitoring",
        title: "Surveillance",
      },
    ],
  },

  // Module e-Learning
  {
    path: "/elearning",
    component: "Elearning",
    title: "e-Learning",
    icon: "Monitor",
    protected: true,
    children: [
      {
        path: "/elearning/courses",
        component: "ElearningCourses",
        title: "Cours",
      },
      {
        path: "/elearning/virtual-classes",
        component: "ElearningVirtualClasses",
        title: "Classes virtuelles",
      },
      {
        path: "/elearning/analytics",
        component: "ElearningAnalytics",
        title: "Analyses",
      },
    ],
  },

  // Module RH
  {
    path: "/hr",
    component: "Hr",
    title: "Ressources Humaines",
    icon: "UserCheck",
    protected: true,
    children: [
      {
        path: "/hr/teachers",
        component: "HrTeachers",
        title: "Enseignants",
      },
      {
        path: "/hr/contracts",
        component: "HrContracts",
        title: "Contrats",
      },
    ],
  },

  // Module Ressources
  {
    path: "/resources",
    component: "Resources",
    title: "Ressources",
    icon: "Package",
    protected: true,
    children: [
      {
        path: "/resources/inventory",
        component: "ResourcesInventory",
        title: "Inventaire",
      },
      {
        path: "/resources/bookings",
        component: "ResourcesBookings",
        title: "Réservations",
      },
    ],
  },

  // Module Services
  {
    path: "/services",
    component: "Services",
    title: "Services",
    icon: "Briefcase",
    protected: true,
    children: [
      {
        path: "/services/transport",
        component: "Transport",
        title: "Transport",
      },
      {
        path: "/services/catering",
        component: "Catering",
        title: "Restauration",
      },
      {
        path: "/services/accommodation",
        component: "Accommodation",
        title: "Hébergement",
      },
    ],
  },

  // Module Communication
  {
    path: "/communication",
    component: "Communication",
    title: "Communication",
    icon: "MessageSquare",
    protected: true,
    children: [
      {
        path: "/communication/messaging",
        component: "Messaging",
        title: "Messagerie",
      },
      {
        path: "/communication/announcements",
        component: "Announcements",
        title: "Annonces",
      },
    ],
  },

  // Module Paramètres
  {
    path: "/settings",
    component: "Settings",
    title: "Paramètres",
    icon: "Settings",
    protected: true,
    children: [
      {
        path: "/settings/general",
        component: "SettingsGeneral",
        title: "Général",
      },
      {
        path: "/settings/users",
        component: "SettingsUsers",
        title: "Utilisateurs",
      },
    ],
  },

  // Routes d'erreur
  {
    path: "/unauthorized",
    component: "Unauthorized",
    title: "Non autorisé",
    protected: false,
  },
  {
    path: "*",
    component: "NotFound",
    title: "Page non trouvée",
    protected: false,
  },
];

// Utilitaires pour la navigation
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  const findRoute = (routes: RouteConfig[], targetPath: string): RouteConfig | undefined => {
    for (const route of routes) {
      if (route.path === targetPath) {
        return route;
      }
      if (route.children) {
        const found = findRoute(route.children, targetPath);
        if (found) return found;
      }
    }
    return undefined;
  };
  
  return findRoute(routesConfig, path);
};

export const getMainModules = (): RouteConfig[] => {
  return routesConfig.filter(route => route.children && route.children.length > 0);
};

export const getBreadcrumbs = (path: string): RouteConfig[] => {
  const breadcrumbs: RouteConfig[] = [];
  const segments = path.split('/').filter(Boolean);
  
  let currentPath = '';
  for (const segment of segments) {
    currentPath += '/' + segment;
    const route = getRouteByPath(currentPath);
    if (route) {
      breadcrumbs.push(route);
    }
  }
  
  return breadcrumbs;
};