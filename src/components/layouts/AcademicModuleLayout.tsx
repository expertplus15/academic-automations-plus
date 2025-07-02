import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AcademicModuleSidebar } from "@/components/AcademicModuleSidebar";
import { AcademicPageHeader } from "@/components/academic/AcademicPageHeader";

interface AcademicModuleLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

export function AcademicModuleLayout({ children, title, subtitle, showHeader = false }: AcademicModuleLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AcademicModuleSidebar />
        <div className="flex-1 flex flex-col">
          <AcademicPageHeader />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}