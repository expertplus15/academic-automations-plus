import React from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { ArrowLeft, Plus, Search, FileDown, Upload, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  variant: 'default' | 'secondary' | 'outline';
  onClick: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: {
    variant: 'scheduled' | 'completed' | 'critical' | 'success' | 'warning' | 'info' | 'error' | 'urgent' | 'attention' | 'pending' | 'active' | 'confirmed' | 'processing' | 'inactive' | 'default' | 'critical-outline' | 'warning-outline' | 'success-outline' | 'info-outline';
    text: string;
  };
  showBackButton?: boolean;
  quickActions?: QuickAction[];
  children?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  subtitle, 
  badge, 
  showBackButton = false, 
  quickActions = [],
  children 
}: PageHeaderProps) {
  const navigate = useNavigate();

  // Default quick actions if none provided
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
    }
  ];

  const displayActions = quickActions.length > 0 ? quickActions : defaultActions;

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
      {/* Main header content */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="h-9 w-9 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {badge && (
                <StatusBadge variant={badge.variant} size="sm">
                  {badge.text}
                </StatusBadge>
              )}
            </div>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {displayActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.onClick}
              className="flex items-center gap-2 h-9"
              size="sm"
            >
              {action.icon}
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom children content */}
      {children && (
        <div className="border-t border-border pt-4">
          {children}
        </div>
      )}
    </div>
  );
}