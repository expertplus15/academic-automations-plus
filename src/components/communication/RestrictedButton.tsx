import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LucideIcon } from 'lucide-react';

interface RestrictedButtonProps {
  children: React.ReactNode;
  allowedRoles: string[];
  action?: () => void;
  restrictedMessage?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
}

export function RestrictedButton({
  children,
  allowedRoles,
  action,
  restrictedMessage = "Vous n'avez pas les permissions pour cette action",
  variant = "default",
  size = "default",
  className,
  icon: Icon,
  loading = false,
  disabled = false
}: RestrictedButtonProps) {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  
  const hasPermission = hasRole(allowedRoles);
  const isDisabled = disabled || loading || !hasPermission;

  const handleClick = () => {
    if (!hasPermission) {
      toast({
        title: "Accès refusé",
        description: restrictedMessage,
        variant: "destructive"
      });
      return;
    }
    
    if (action && !loading) {
      action();
    }
  };

  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        Icon && <Icon className="w-4 h-4 mr-2" />
      )}
      {children}
    </Button>
  );

  if (!hasPermission) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{restrictedMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
}