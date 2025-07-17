import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ElementMenuButtonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export function ElementMenuButton({ icon: Icon, title, description, onClick }: ElementMenuButtonProps) {
  return (
    <Button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }} 
      variant="ghost" 
      size="sm" 
      className="w-full justify-start text-left p-2 h-auto hover:bg-accent transition-colors"
    >
      <div className="flex items-start gap-2 w-full">
        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
    </Button>
  );
}