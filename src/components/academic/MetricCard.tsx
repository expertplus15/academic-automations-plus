import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color?: string;
  loading?: boolean;
}

export function MetricCard({ title, value, icon: Icon, trend, color = "text-primary", loading }: MetricCardProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-muted rounded w-1/2 mb-1"></div>
          <div className="h-3 bg-muted rounded w-2/3"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground mb-1">
              {value}
            </p>
            {trend && (
              <p className="text-xs text-muted-foreground">
                {trend}
              </p>
            )}
          </div>
          <div className="ml-4">
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}