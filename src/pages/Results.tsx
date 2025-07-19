import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { UnifiedDashboard } from '@/components/unified/UnifiedDashboard';
import { GradingSystemConfig } from '@/components/results/GradingSystemConfig';
import GradeEntry from "./results/GradeEntry";
import Calculations from "./results/Calculations";
import Validation from "./results/Validation";
import Documentation from "./results/Documentation";
import { default as RefactoredPersonalisation } from "./results/RefactoredPersonalisation";
import Production from "./results/Production";
import Analytics from "./results/Analytics";

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
          component: <GradeEntry />
        },
        '/results/calculations': {
          title: "Calculs & Moyennes",
          subtitle: "Moyennes, ECTS, compensations et mentions automatiques",
          component: <Calculations />
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
          component: <Analytics />
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

  // Default dashboard - redirect to unified interface
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <ModuleLayout 
        title="Tableau de Bord Unifiée" 
        subtitle="Vue d'ensemble des examens, notes et workflows automatisés"
        showHeader={true}
      >
        <div className="p-6 animate-fade-in">
          <UnifiedDashboard />
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}