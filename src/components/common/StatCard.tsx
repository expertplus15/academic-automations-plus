import React from 'react';
import { StatusBadge } from '@/components/ui/status-badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period?: string;
  };
  badge?: {
    variant: 'scheduled' | 'completed' | 'critical' | 'success' | 'warning' | 'info' | 'error' | 'urgent' | 'attention' | 'pending' | 'active' | 'confirmed' | 'processing' | 'inactive' | 'default' | 'critical-outline' | 'warning-outline' | 'success-outline' | 'info-outline';
    text: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  label, 
  trend, 
  badge, 
  icon,
  className 
}: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={cn(
      "bg-card rounded-xl shadow-sm border border-border p-6 relative",
      className
    )}>
      {/* Header with title and optional badge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {badge && (
          <StatusBadge variant={badge.variant} size="sm">
            {badge.text}
          </StatusBadge>
        )}
      </div>

      {/* Main content */}
      <div className="flex items-center gap-4">
        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0 text-primary">
            {icon}
          </div>
        )}

        {/* Value and label */}
        <div className="flex-1">
          <div className="text-3xl font-bold text-foreground mb-1">
            {value}
          </div>
          <div className="text-sm text-muted-foreground">
            {label}
          </div>
        </div>
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className={cn(
          "flex items-center gap-1 mt-4 text-sm",
          getTrendColor()
        )}>
          {getTrendIcon()}
          <span className="font-medium">
            {Math.abs(trend.value)}%
          </span>
          {trend.period && (
            <span className="text-muted-foreground">
              {trend.period}
            </span>
          )}
        </div>
      )}
    </div>
  );
}