import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ResultsModuleSidebar } from "@/components/ResultsModuleSidebar";
import { ResultsPageHeader } from "@/components/results/ResultsPageHeader";
import { AcademicYearProvider } from '@/contexts/AcademicYearContext';

interface ResultsModuleLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  actions?: React.ReactNode;
}

export function ResultsModuleLayout({ 
  children, 
  title, 
  subtitle, 
  showHeader = true,
  actions
}: ResultsModuleLayoutProps) {
  return (
    <AcademicYearProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-background">
          <ResultsModuleSidebar />
          <div className="flex-1 flex flex-col">
            {showHeader && (
              <ResultsPageHeader 
                title={title} 
                subtitle={subtitle}
                actions={actions}
              />
            )}
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AcademicYearProvider>
  );
}