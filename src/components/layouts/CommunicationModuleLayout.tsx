import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CommunicationModuleSidebar } from "@/components/CommunicationModuleSidebar";
import { CommunicationHeader } from "@/components/communication/CommunicationHeader";

interface CommunicationModuleLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  actions?: Array<{
    label: string;
    icon: React.ComponentType<any>;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
}

export function CommunicationModuleLayout({ 
  children, 
  title, 
  subtitle, 
  showHeader = true,
  actions = []
}: CommunicationModuleLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CommunicationModuleSidebar />
        <div className="flex-1 flex flex-col">
          {showHeader && title && (
            <CommunicationHeader 
              title={title} 
              subtitle={subtitle || ''} 
              actions={actions}
            />
          )}
          {!showHeader && (
            <header className="h-12 flex items-center border-b bg-card px-4">
              <SidebarTrigger />
            </header>
          )}
          {(title || subtitle) && !showHeader && (
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