// Configuration de base pour les routes
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

// Routes publiques de base
export const baseRoutes: RouteConfig[] = [
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
  {
    path: "/dashboard",
    component: "Dashboard",
    title: "Tableau de bord",
    protected: true,
  },
];

// Routes d'erreur
export const errorRoutes: RouteConfig[] = [
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