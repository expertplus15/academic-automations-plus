import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Construction, AlertCircle } from 'lucide-react';

interface DevelopmentBadgeProps {
  status: 'development' | 'beta' | 'coming-soon';
  size?: 'sm' | 'md';
}

export function DevelopmentBadge({ status, size = 'sm' }: DevelopmentBadgeProps) {
  const config = {
    development: {
      label: 'En développement',
      className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      icon: Construction
    },
    beta: {
      label: 'Bêta',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      icon: AlertCircle
    },
    'coming-soon': {
      label: 'Bientôt disponible',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      icon: AlertCircle
    }
  };

  const { label, className, icon: Icon } = config[status];
  
  return (
    <Badge className={`${className} ${size === 'sm' ? 'text-xs' : 'text-sm'} flex items-center gap-1`}>
      <Icon className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
      {label}
    </Badge>
  );
}