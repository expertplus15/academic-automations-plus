import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ResultsModuleLayout } from '@/components/layouts/ResultsModuleLayout';

// Import components
import { ResultsDashboard } from '@/components/dashboard/ResultsDashboard';
import { GradingSystemConfig } from '@/components/results/GradingSystemConfig';
import { GradeEntryContent } from '@/components/results/grade-entry/GradeEntryContent';
import { GradeCalculations } from '@/components/results/GradeCalculations';
import { ResultsAnalytics } from '@/components/results/ResultsAnalytics';

// Import pages
import Validation from '@/pages/results/Validation';
import Documentation from '@/pages/results/Documentation';
import RefactoredPersonalisation from '@/pages/results/RefactoredPersonalisation';
import Production from '@/pages/results/Production';
import { PromotionManagement } from '@/components/results/promotion/PromotionManagement';

// Route configuration with metadata
const resultsRoutes = [
  {
    path: '',
    title: 'Évaluations & Résultats',
    subtitle: 'Système de notation automatisé et interface matricielle collaborative',
    component: ResultsDashboard,
    showHeader: true
  },
  {
    path: 'grading-system',
    title: 'Système de Notation',
    subtitle: 'Configuration du barème, pondération et règles de calcul',
    component: GradingSystemConfig,
    showHeader: true
  },
  {
    path: 'grade-entry',
    title: 'Saisie des Notes',
    subtitle: 'Interface matricielle collaborative et saisie manuelle des notes',
    component: GradeEntryContent,
    showHeader: true
  },
  {
    path: 'calculations',
    title: 'Calculs & Moyennes',
    subtitle: 'Moyennes, ECTS, compensations et mentions automatiques',
    component: GradeCalculations,
    showHeader: true
  },
  {
    path: 'validation',
    title: 'Validation',
    subtitle: 'Consultation et validation des résultats',
    component: Validation,
    showHeader: true
  },
  {
    path: 'documentation',
    title: 'Documentation',
    subtitle: 'Création et gestion des types de documents',
    component: Documentation,
    showHeader: true
  },
  {
    path: 'personalisation',
    title: 'Personnalisation',
    subtitle: 'Studio de création des templates',
    component: RefactoredPersonalisation,
    showHeader: true
  },
  {
    path: 'production',
    title: 'Production',
    subtitle: 'Centre de production et export en masse',
    component: Production,
    showHeader: true
  },
  {
    path: 'analytics',
    title: 'Analyse & Contrôle',
    subtitle: 'Statistiques avancées et validation des données',
    component: ResultsAnalytics,
    showHeader: true
  },
  {
    path: 'promotion',
    title: 'Promotion des Étudiants',
    subtitle: 'Gestion intelligente des promotions d\'année et critères d\'évaluation',
    component: PromotionManagement,
    showHeader: true
  }
];

export default function ResultsRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <Routes>
        {resultsRoutes.map((route) => {
          const Component = route.component;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ResultsModuleLayout
                  title={route.title}
                  subtitle={route.subtitle}
                  showHeader={route.showHeader}
                >
                  <Component />
                </ResultsModuleLayout>
              }
            />
          );
        })}
      </Routes>
    </ProtectedRoute>
  );
}