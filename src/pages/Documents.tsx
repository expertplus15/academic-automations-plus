import React from 'react';
import { useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { DocumentsPageHeader } from "@/components/DocumentsPageHeader";
import { DocumentsDashboard } from "@/components/documents/DocumentsDashboard";
import { SignatureManager } from "@/components/documents/SignatureManager";
import { DocumentGenerator } from "@/components/documents/DocumentGenerator";
import { AcademicDocumentGenerator } from "@/components/documents/AcademicDocumentGenerator";
import { DocumentSearch } from "@/components/documents/DocumentSearch";
import { TemplateManager } from "@/components/documents/TemplateManager";
import { AcademicTemplateManager } from "@/components/documents/AcademicTemplateManager";
import { DocumentArchives } from "@/components/documents/DocumentArchives";
import { DocumentValidation } from "@/components/documents/DocumentValidation";
import { DocumentDistribution } from "@/components/documents/DocumentDistribution";
import { DocumentNotifications } from "@/components/documents/DocumentNotifications";
import { DocumentSettings } from "@/components/documents/DocumentSettings";

export default function Documents() {
  const location = useLocation();
  
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/documents/signatures') {
      return <SignatureManager />;
    }
    if (path === '/documents/generator') {
      return <AcademicDocumentGenerator />;
    }
    if (path === '/documents/generator-legacy') {
      return <DocumentGenerator />;
    }
    if (path === '/documents/search') {
      return <DocumentSearch />;
    }
    if (path === '/documents/templates') {
      return <AcademicTemplateManager />;
    }
    if (path === '/documents/templates-legacy') {
      return <TemplateManager />;
    }
    if (path === '/documents/archives') {
      return <DocumentArchives />;
    }
    if (path === '/documents/validation') {
      return <DocumentValidation />;
    }
    if (path === '/documents/distribution') {
      return <DocumentDistribution />;
    }
    if (path === '/documents/notifications') {
      return <DocumentNotifications />;
    }
    if (path === '/documents/settings') {
      return <DocumentSettings />;
    }
    
    // Default to dashboard for /documents
    return <DocumentsDashboard />;
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher']}>
      <ModuleLayout>
        <DocumentsPageHeader 
          title="Gestion Documentaire" 
          subtitle="Service centralisé de gestion des documents" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}