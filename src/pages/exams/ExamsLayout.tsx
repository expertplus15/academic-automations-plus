import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ExamsModuleSidebar } from '@/components/ExamsModuleSidebar';
import { AcademicYearProvider } from '@/contexts/AcademicYearContext';

export default function ExamsLayout() {
  return (
    <AcademicYearProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <ExamsModuleSidebar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </AcademicYearProvider>
  );
}
