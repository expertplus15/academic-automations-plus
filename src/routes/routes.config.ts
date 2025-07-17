// Configuration centralisée des routes - Version refactorisée
// Les routes sont maintenant organisées par modules dans des fichiers séparés

export {
  routesConfig,
  getRouteByPath,
  getMainModules,
  getBreadcrumbs,
  type RouteConfig
} from './config';