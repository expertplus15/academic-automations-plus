import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentsModuleSidebar } from "@/components/StudentsModuleSidebar";
import { StudentsPageHeader } from "@/components/StudentsPageHeader";

interface StudentsModuleLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

export function StudentsModuleLayout({ 
  children, 
  title, 
  subtitle, 
  showHeader = true 
}: StudentsModuleLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <StudentsModuleSidebar />
        <div className="flex-1 flex flex-col">
          {showHeader && <StudentsPageHeader />}
          {!showHeader && (
            <header className="h-12 flex items-center border-b bg-card px-4">
              <SidebarTrigger />
            </header>
          )}
          {(title || subtitle) && (
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