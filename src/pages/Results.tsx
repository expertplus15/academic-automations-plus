
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { AcademicYearProvider } from '@/contexts/AcademicYearContext';

// Lazy loading des composants
import { ResultsDashboard } from '@/components/dashboard/ResultsDashboard';
import { GradingSystemConfig } from '@/components/results/GradingSystemConfig';
import GradeEntry from './results/GradeEntry';
import { GradeCalculations } from '@/components/results/GradeCalculations';
import { ResultsAnalytics } from '@/components/results/ResultsAnalytics';
import Validation from "./results/Validation";
import Documentation from "./results/Documentation";
import { default as RefactoredPersonalisation } from "./results/RefactoredPersonalisation";
import Production from "./results/Production";

export default function Results() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicYearProvider>
        <Routes>
          {/* Dashboard principal */}
          <Route 
            index 
            element={
              <ModuleLayout 
                title="Évaluations & Résultats" 
                subtitle="Système de notation automatisé et interface matricielle collaborative"
                showHeader={true}
              >
                <ResultsDashboard />
              </ModuleLayout>
            } 
          />
          
          {/* Routes des sous-modules */}
          <Route 
            path="grading-system" 
            element={
              <ModuleLayout 
                title="Système de Notation"
                subtitle="Configuration du barème, pondération et règles de calcul"
                showHeader={true}
              >
                <GradingSystemConfig />
              </ModuleLayout>
            } 
          />
          
          <Route 
            path="grade-entry" 
            element={
              <ModuleLayout 
                title="Saisie des Notes" 
                subtitle="Interface matricielle collaborative et saisie manuelle des notes"
                showHeader={true}
              >
                <GradeEntry />
              </ModuleLayout>
            } 
          />
          
          <Route 
            path="calculations" 
            element={
              <ModuleLayout 
                title="Calculs & Moyennes"
                subtitle="Moyennes, ECTS, compensations et mentions automatiques"
                showHeader={true}
              >
                <GradeCalculations />
              </ModuleLayout>
            } 
          />
          
          <Route 
            path="validation" 
            element={
              <ModuleLayout 
                title="Validation"
                subtitle="Consultation et validation des résultats"
                showHeader={true}
              >
                <Validation />
              </ModuleLayout>
            } 
          />
          
          <Route 
            path="documentation" 
            element={
              <ModuleLayout 
                title="Documentation"
                subtitle="Création et gestion des types de documents"
                showHeader={true}
              >
                <Documentation />
              </ModuleLayout>
            } 
          />
          
          <Route 
            path="personalisation" 
            element={
              <ModuleLayout 
                title="Personnalisation"
                subtitle="Studio de création des templates"
                showHeader={true}
              >
                <RefactoredPersonalisation />
              </ModuleLayout>
            } 
          />
          
          <Route 
            path="production" 
            element={
              <ModuleLayout 
                title="Production"
                subtitle="Centre de production et export en masse"
                showHeader={true}
              >
                <Production />
              </ModuleLayout>
            } 
          />
          
          <Route 
            path="analytics" 
            element={
              <ModuleLayout 
                title="Analyse & Contrôle"
                subtitle="Statistiques avancées et validation des données"
                showHeader={true}
              >
                <ResultsAnalytics />
              </ModuleLayout>
            } 
          />
        </Routes>
      </AcademicYearProvider>
    </ProtectedRoute>
  );
}
