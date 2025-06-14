import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getSidebarForPath } from '@/utils/sidebarUtils';

interface ModuleLayoutProps {
  children: React.ReactNode;
}

export function ModuleLayout({ children }: ModuleLayoutProps) {
  const location = useLocation();
  const SidebarComponent = getSidebarForPath(location.pathname);

  if (!SidebarComponent) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarComponent />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}