
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
import { AcademicYearManagement } from '@/components/academic/AcademicYearManagement';
import { AcademicYearProvider } from '@/contexts/AcademicYearContext';
import Validation from "./results/Validation";
import Documentation from "./results/Documentation";
import { default as RefactoredPersonalisation } from "./results/RefactoredPersonalisation";
import Production from "./results/Production";

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
        '/results/validation': {
          title: "Validation",
          subtitle: "Consultation et validation des résultats",
          component: <Validation />
        },
        '/results/documentation': {
          title: "Documentation",
          subtitle: "Création et gestion des types de documents",
          component: <Documentation />
        },
        '/results/personalisation': {
          title: "Personnalisation",
          subtitle: "Studio de création des templates",
          component: <RefactoredPersonalisation />
        },
        '/results/production': {
          title: "Production",
          subtitle: "Centre de production et export en masse",
          component: <Production />
        },
        '/results/analytics': {
          title: "Analyse & Contrôle",
          subtitle: "Statistiques avancées et validation des données",
          component: <ResultsAnalytics />
        },
        '/results/academic-year-management': {
          title: "Gestion des Années Académiques",
          subtitle: "Validation, archivage et promotion des étudiants",
          component: <AcademicYearManagement />
        }
      };

      const route = routeMap[location.pathname];
      if (route) {
        return (
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <AcademicYearProvider>
              <ModuleLayout 
                title={route.title}
                subtitle={route.subtitle}
                showHeader={true}
              >
                <div className="p-6">
                  {route.component}
                </div>
              </ModuleLayout>
            </AcademicYearProvider>
          </ProtectedRoute>
        );
      }
    }
  }

  // Default dashboard
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicYearProvider>
        <ModuleLayout 
          title="Évaluations & Résultats" 
          subtitle="Système de notation automatisé et interface matricielle collaborative"
          showHeader={true}
        >
          <div className="p-6">
            <ResultsDashboard />
          </div>
        </ModuleLayout>
      </AcademicYearProvider>
    </ProtectedRoute>
  );
}
