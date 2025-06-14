import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarForPath } from "@/utils/sidebarUtils";

interface ModuleLayoutProps {
  children: ReactNode;
}

export function ModuleLayout({ children }: ModuleLayoutProps) {
  const location = useLocation();
  const SidebarComponent = getSidebarForPath(location.pathname);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {SidebarComponent && <SidebarComponent />}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}