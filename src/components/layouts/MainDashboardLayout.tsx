import React from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';

interface MainDashboardLayoutProps {
  children: React.ReactNode;
}

export function MainDashboardLayout({ children }: MainDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DashboardHeader />
      <main className="pt-4">
        {children}
      </main>
    </div>
  );
}