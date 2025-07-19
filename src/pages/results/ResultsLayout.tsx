
import React from 'react';
import { Outlet } from "react-router-dom";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicYearProvider } from '@/contexts/AcademicYearContext';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function ResultsLayout() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicYearProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-background">
            <Outlet />
          </div>
        </SidebarProvider>
      </AcademicYearProvider>
    </ProtectedRoute>
  );
}
