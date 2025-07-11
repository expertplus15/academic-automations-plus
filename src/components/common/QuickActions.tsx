import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, FileDown, Upload, Settings } from 'lucide-react';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  variant: 'default' | 'secondary' | 'outline';
  onClick: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  title?: string;
}

export function QuickActions({ 
  actions = [], 
  title = "Actions Rapides" 
}: QuickActionsProps) {
  // Default actions if none provided
  const defaultActions: QuickAction[] = [
    {
      label: "Créer",
      icon: <Plus className="w-4 h-4" />,
      variant: "default",
      onClick: () => console.log("Create action")
    },
    {
      label: "Rechercher",
      icon: <Search className="w-4 h-4" />,
      variant: "secondary",
      onClick: () => console.log("Search action")
    },
    {
      label: "Exporter",
      icon: <FileDown className="w-4 h-4" />,
      variant: "outline",
      onClick: () => console.log("Export action")
    },
    {
      label: "Importer",
      icon: <Upload className="w-4 h-4" />,
      variant: "outline", 
      onClick: () => console.log("Import action")
    },
    {
      label: "Paramètres",
      icon: <Settings className="w-4 h-4" />,
      variant: "outline",
      onClick: () => console.log("Settings action")
    }
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      
      <div className="flex flex-wrap gap-3">
        {displayActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            onClick={action.onClick}
            className="flex items-center gap-2 h-10 px-4"
          >
            {action.icon}
            <span className="hidden sm:inline">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}