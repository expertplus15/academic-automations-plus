import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ServicesModuleSidebar } from "@/components/ServicesModuleSidebar";
import { ServicesPageHeader } from "@/components/ServicesPageHeader";

interface ServicesModuleLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

export function ServicesModuleLayout({ 
  children, 
  title, 
  subtitle, 
  showHeader = true 
}: ServicesModuleLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ServicesModuleSidebar />
        <div className="flex-1 flex flex-col">
          {showHeader && <ServicesPageHeader title={title || ""} subtitle={subtitle || ""} />}
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