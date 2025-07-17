import { RouteConfig } from '../base.config';

export const resultsRoutes: RouteConfig = {
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
};