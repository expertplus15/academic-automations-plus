import { SidebarProvider } from "@/components/ui/sidebar";
import { CommunicationModuleSidebar } from "@/components/CommunicationModuleSidebar";

interface CommunicationModuleLayoutProps {
  children: React.ReactNode;
}

export function CommunicationModuleLayout({ children }: CommunicationModuleLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CommunicationModuleSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}