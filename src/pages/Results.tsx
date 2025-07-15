import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResultsDashboard } from '@/components/dashboard/ResultsDashboard';
import { DocumentsEvaluationInterface } from '@/components/results/documents/DocumentsEvaluationInterface';
import { GradingSystemConfig } from '@/components/results/GradingSystemConfig';
import { MatrixGradeEntry } from '@/components/results/MatrixGradeEntry';
import { GradeCalculations } from '@/components/results/GradeCalculations';
import { ResultsAnalytics } from '@/components/results/ResultsAnalytics';

export default function Results() {
  const location = useLocation();
  
  // Check if we're on a sub-route
  const isSubRoute = location.pathname !== '/results';
  
  if (isSubRoute) {
    // Handle all sub-routes with improved routing
    if (location.pathname.startsWith('/results/')) {
      const routeMap = {
        '/results/grading-system': {
          title: "Système de Notation",
          subtitle: "Configuration du barème, pondération et règles de calcul",
          component: <GradingSystemConfig />
        },
        '/results/grade-entry': {
          title: "Saisie des Notes",
          subtitle: "Interface matricielle collaborative pour la saisie des notes en temps réel",
          component: <MatrixGradeEntry />
        },
        '/results/calculations': {
          title: "Calculs & Moyennes",
          subtitle: "Moyennes, ECTS, compensations et mentions automatiques",
          component: <GradeCalculations />
        },
        '/results/documents': {
          title: "Documents",
          subtitle: "Bulletins, relevés, attestations et templates personnalisables",
          component: <DocumentsEvaluationInterface />
        },
        '/results/analytics': {
          title: "Analyse & Contrôle",
          subtitle: "Statistiques avancées et validation des données",
          component: <ResultsAnalytics />
        }
      };

      const route = routeMap[location.pathname];
      if (route) {
        return (
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <ModuleLayout 
              title={route.title}
              subtitle={route.subtitle}
              showHeader={true}
            >
              <div className="p-6">
                {route.component}
              </div>
            </ModuleLayout>
          </ProtectedRoute>
        );
      }
    }
  }

  // Default dashboard
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <ModuleLayout 
        title="Évaluations & Résultats" 
        subtitle="Système de notation automatisé et interface matricielle collaborative"
        showHeader={true}
      >
        <div className="p-6">
          <ResultsDashboard />
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}