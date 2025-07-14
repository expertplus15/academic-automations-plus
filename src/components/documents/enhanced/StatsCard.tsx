import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

const colorVariants = {
  blue: {
    gradient: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-700',
  },
  green: {
    gradient: 'from-green-50 to-green-100',
    border: 'border-green-200',
    icon: 'text-green-600',
    text: 'text-green-700',
  },
  purple: {
    gradient: 'from-purple-50 to-purple-100',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    text: 'text-purple-700',
  },
  orange: {
    gradient: 'from-orange-50 to-orange-100',
    border: 'border-orange-200',
    icon: 'text-orange-600',
    text: 'text-orange-700',
  },
  red: {
    gradient: 'from-red-50 to-red-100',
    border: 'border-red-200',
    icon: 'text-red-600',
    text: 'text-red-700',
  },
};

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color = 'blue',
  className 
}: StatsCardProps) {
  const colorConfig = colorVariants[color];

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-md",
      "hover:-translate-y-0.5",
      className
    )}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        colorConfig.gradient
      )} />
      
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <p className={cn(
                "text-3xl font-bold",
                colorConfig.text
              )}>
                {value}
              </p>
              {trend && (
                <span className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-lg bg-white/60 border",
            colorConfig.border
          )}>
            <Icon className={cn("w-6 h-6", colorConfig.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}