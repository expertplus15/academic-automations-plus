import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsModuleSidebar } from "@/components/SettingsModuleSidebar";

interface SettingsModuleLayoutProps {
  children: React.ReactNode;
}

export function SettingsModuleLayout({ children }: SettingsModuleLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SettingsModuleSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}