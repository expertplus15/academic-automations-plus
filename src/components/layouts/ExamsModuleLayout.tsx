import { ReactNode } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ExamsModuleSidebar } from '@/components/ExamsModuleSidebar';
import { ExamsPageHeader } from '@/components/ExamsPageHeader';

interface ExamsModuleLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function ExamsModuleLayout({ children, title, subtitle }: ExamsModuleLayoutProps) {
  return (
    <ModuleLayout sidebar={<ExamsModuleSidebar />}>
      <div className="min-h-screen bg-background">
        <ExamsPageHeader title={title} subtitle={subtitle} />
        {children}
      </div>
    </ModuleLayout>
  );
}