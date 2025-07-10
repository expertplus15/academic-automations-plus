import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Search } from 'lucide-react';

interface CommunicationHeaderProps {
  title: string;
  subtitle: string;
  actions?: Array<{
    label: string;
    icon: React.ComponentType<any>;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
}

export function CommunicationHeader({ title, subtitle, actions = [] }: CommunicationHeaderProps) {
  const defaultActions = [
    {
      label: "Rechercher",
      icon: Search,
      onClick: () => {},
      variant: 'outline' as const
    },
    {
      label: "Paramètres",
      icon: Settings,
      onClick: () => {},
      variant: 'outline' as const
    }
  ];

  const allActions = [...actions, ...defaultActions];

  return (
    <div className="bg-card border-b border-border/20 px-8 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {allActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                size="sm"
                onClick={action.onClick}
                className="flex items-center gap-2"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}