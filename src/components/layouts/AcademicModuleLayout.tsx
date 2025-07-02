import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AcademicModuleSidebar } from "@/components/AcademicModuleSidebar";

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
          <header className="h-12 flex items-center border-b bg-card px-4">
            <SidebarTrigger />
          </header>
          {showHeader && (title || subtitle) && (
            <div className="bg-card border-b border-border/20 px-8 py-6">
              <div className="max-w-6xl mx-auto">
                {title && <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>}
                {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
          )}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}