import React from 'react';

interface MainDashboardLayoutProps {
  children: React.ReactNode;
}

export function MainDashboardLayout({ children }: MainDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}