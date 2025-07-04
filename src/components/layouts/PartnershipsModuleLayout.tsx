import { SidebarProvider } from "@/components/ui/sidebar";
import { PartnershipsModuleSidebar } from "@/components/PartnershipsModuleSidebar";

interface PartnershipsModuleLayoutProps {
  children: React.ReactNode;
}

export function PartnershipsModuleLayout({ children }: PartnershipsModuleLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PartnershipsModuleSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}