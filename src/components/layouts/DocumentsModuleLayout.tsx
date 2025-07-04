import { SidebarProvider } from "@/components/ui/sidebar";
import { DocumentsModuleSidebar } from "@/components/DocumentsModuleSidebar";

interface DocumentsModuleLayoutProps {
  children: React.ReactNode;
}

export function DocumentsModuleLayout({ children }: DocumentsModuleLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DocumentsModuleSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}