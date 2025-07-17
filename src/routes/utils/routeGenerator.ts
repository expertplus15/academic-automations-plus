import { RouteConfig } from '../config';

/**
 * Génère dynamiquement les routes React Router à partir de la configuration
 */
export const generateRoutes = (routes: RouteConfig[]) => {
  return routes.map(route => ({
    path: route.path,
    element: route.component,
    children: route.children ? generateRoutes(route.children) : undefined,
  }));
};

/**
 * Extrait toutes les routes plates à partir de la configuration hiérarchique
 */
export const flattenRoutes = (routes: RouteConfig[]): RouteConfig[] => {
  const flattened: RouteConfig[] = [];
  
  const flatten = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      flattened.push(route);
      if (route.children) {
        flatten(route.children);
      }
    });
  };
  
  flatten(routes);
  return flattened;
};

/**
 * Valide la configuration des routes
 */
export const validateRoutes = (routes: RouteConfig[]): string[] => {
  const errors: string[] = [];
  const paths = new Set<string>();
  
  const validate = (routeList: RouteConfig[], parentPath = '') => {
    routeList.forEach(route => {
      const fullPath = parentPath + route.path;
      
      // Vérifier les doublons
      if (paths.has(fullPath)) {
        errors.push(`Duplicate path found: ${fullPath}`);
      }
      paths.add(fullPath);
      
      // Vérifier les champs requis
      if (!route.title) {
        errors.push(`Missing title for route: ${fullPath}`);
      }
      
      if (!route.component) {
        errors.push(`Missing component for route: ${fullPath}`);
      }
      
      // Valider les enfants
      if (route.children) {
        validate(route.children, fullPath);
      }
    });
  };
  
  validate(routes);
  return errors;
};