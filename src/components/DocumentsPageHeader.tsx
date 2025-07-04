import { SidebarTrigger } from "@/components/ui/sidebar";
import { FileText } from "lucide-react";

interface DocumentsPageHeaderProps {
  title: string;
  subtitle: string;
}

export function DocumentsPageHeader({ title, subtitle }: DocumentsPageHeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4F78FF] rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}