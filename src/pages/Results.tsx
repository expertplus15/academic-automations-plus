import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResultsDashboard } from '@/components/dashboard/ResultsDashboard';
import { DocumentsEvaluationInterface } from '@/components/results/documents/DocumentsEvaluationInterface';

export default function Results() {
  const location = useLocation();
  
  // Check if we're on a sub-route
  const isSubRoute = location.pathname !== '/results';
  
  if (isSubRoute) {
    // Handle sub-routes - for now just documents
    if (location.pathname === '/results/documents') {
      return (
        <ProtectedRoute allowedRoles={['admin', 'teacher']}>
          <ModuleLayout 
            title="Documents & Bulletins" 
            subtitle="Gestion des documents d'évaluation et génération de bulletins"
            showHeader={true}
          >
            <div className="p-6">
              <DocumentsEvaluationInterface />
            </div>
          </ModuleLayout>
        </ProtectedRoute>
      );
    }
  }

  // Default dashboard
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <ModuleLayout 
        title="Évaluations & Résultats" 
        subtitle="Interface matricielle collaborative et bulletins ultra-rapides"
        showHeader={true}
      >
        <div className="p-6">
          <ResultsDashboard />
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}