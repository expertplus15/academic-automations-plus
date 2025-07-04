import { SidebarTrigger } from "@/components/ui/sidebar";
import { Coffee } from "lucide-react";

interface ServicesPageHeaderProps {
  title: string;
  subtitle: string;
}

export function ServicesPageHeader({ title, subtitle }: ServicesPageHeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
            <Coffee className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Services aux Étudiants</h1>
            <p className="text-sm text-muted-foreground">Module de gestion des services</p>
          </div>
        </div>
      </div>
    </header>
  );
}