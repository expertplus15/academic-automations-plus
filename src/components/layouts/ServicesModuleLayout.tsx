import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ServicesModuleSidebar } from "@/components/ServicesModuleSidebar";

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
          <header className="h-16 flex items-center justify-between border-b bg-card px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              {(title || subtitle) && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.5 3H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H6c-.55 0-1-.45-1-1s.45-1 1-1h12.5c.28 0 .5-.22.5-.5v-14c0-.28-.22-.5-.5-.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                  </div>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}