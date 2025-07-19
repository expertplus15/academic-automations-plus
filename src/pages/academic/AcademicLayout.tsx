import React from 'react';
import { Outlet } from "react-router-dom";
import { SidebarProvider } from '@/components/ui/sidebar';
import { AcademicYearProvider } from '@/contexts/AcademicYearContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AcademicLayout() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicYearProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-background">
            <div className="container mx-auto p-6">
              <Outlet />
            </div>
          </div>
        </SidebarProvider>
      </AcademicYearProvider>
    </ProtectedRoute>
  );
}