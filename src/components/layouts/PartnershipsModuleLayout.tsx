import { PartnershipsModuleSidebar } from "@/components/PartnershipsModuleSidebar";

interface PartnershipsModuleLayoutProps {
  children: React.ReactNode;
}

export function PartnershipsModuleLayout({ children }: PartnershipsModuleLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <PartnershipsModuleSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}