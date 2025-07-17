// Configuration centralisée des routes de l'application
import { RouteConfig, baseRoutes, errorRoutes } from './base.config';
import {
  financeRoutes,
  studentsRoutes,
  academicRoutes,
  resultsRoutes,
  examsRoutes,
  elearningRoutes,
  hrRoutes,
  resourcesRoutes,
  servicesRoutes,
  communicationRoutes,
  settingsRoutes,
} from './modules';

// Autres modules
const otherModules: RouteConfig[] = [
  {
    path: "/documents",
    component: "Documents",
    title: "Documents",
    icon: "FileText",
    protected: true,
  },
  {
    path: "/partnerships",
    component: "Partnerships",
    title: "Partenariats",
    icon: "Handshake",
    protected: true,
  },
];

// Configuration complète des routes
export const routesConfig: RouteConfig[] = [
  ...baseRoutes,
  financeRoutes,
  studentsRoutes,
  academicRoutes,
  resultsRoutes,
  examsRoutes,
  elearningRoutes,
  hrRoutes,
  resourcesRoutes,
  servicesRoutes,
  communicationRoutes,
  settingsRoutes,
  ...otherModules,
  ...errorRoutes,
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

// Réexport des types et utilitaires
export type { RouteConfig } from './base.config';