import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'centered' | 'compact';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default'
}: EmptyStateProps) {
  const isCompact = variant === 'compact';
  const isCentered = variant === 'centered';

  const content = (
    <>
      <div className={`mx-auto mb-4 ${isCompact ? 'w-12 h-12' : 'w-16 h-16'}`}>
        <div className={`w-full h-full bg-gray-100 rounded-full flex items-center justify-center ${isCompact ? 'p-2' : 'p-3'}`}>
          <Icon className={`text-gray-400 ${isCompact ? 'w-6 h-6' : 'w-8 h-8'}`} />
        </div>
      </div>
      
      <h3 className={`font-semibold text-gray-900 mb-2 ${isCompact ? 'text-lg' : 'text-xl'}`}>
        {title}
      </h3>
      
      <p className={`text-gray-600 mb-6 ${isCompact ? 'text-sm' : 'text-base'} ${isCentered ? 'max-w-md mx-auto' : ''}`}>
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          size={isCompact ? 'sm' : 'default'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {actionLabel}
        </Button>
      )}
    </>
  );

  if (variant === 'centered') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          {content}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="py-8 text-center">
        {content}
      </div>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0">
      <CardHeader className="pb-4">
        <div className="text-center">
          {content}
        </div>
      </CardHeader>
    </Card>
  );
}