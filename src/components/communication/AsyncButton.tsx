import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LucideIcon } from 'lucide-react';

interface AsyncButtonProps {
  children: React.ReactNode;
  onAsyncClick: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  timeout?: number;
}

export function AsyncButton({
  children,
  onAsyncClick,
  successMessage,
  errorMessage = "Une erreur est survenue",
  variant = "default",
  size = "default",
  className,
  icon: Icon,
  disabled = false,
  timeout = 30000 // 30 seconds timeout
}: AsyncButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    if (loading) return;
    
    setLoading(true);
    
    const timeoutId = setTimeout(() => {
      setLoading(false);
      toast({
        title: "Timeout",
        description: "L'opération a pris trop de temps",
        variant: "destructive"
      });
    }, timeout);

    try {
      await onAsyncClick();
      
      if (successMessage) {
        toast({
          title: "Succès",
          description: successMessage
        });
      }
    } catch (error) {
      console.error('AsyncButton error:', error);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        Icon && <Icon className="w-4 h-4 mr-2" />
      )}
      {children}
    </Button>
  );
}