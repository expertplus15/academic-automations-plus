import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickInsightsCardProps {
  sourceModule: 'dashboard' | 'analytics';
  data: {
    title: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'stable';
    description: string;
    actionText: string;
    targetPath: string;
  }[];
}

export function QuickInsightsCard({ sourceModule, data }: QuickInsightsCardProps) {
  const navigate = useNavigate();
  
  const moduleTitle = sourceModule === 'dashboard' 
    ? 'Aperçu Analytics' 
    : 'Activité Temps Réel';
    
  const moduleIcon = sourceModule === 'dashboard' 
    ? TrendingUp 
    : Activity;

  const IconComponent = moduleIcon;

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend?: string) => {
    const className = "w-3 h-3";
    switch (trend) {
      case 'up': return <TrendingUp className={`${className} text-green-600`} />;
      case 'down': return <TrendingUp className={`${className} text-red-600 rotate-180`} />;
      default: return <Target className={`${className} text-gray-600`} />;
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <IconComponent className="w-5 h-5 text-emerald-500" />
          {moduleTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{item.title}</span>
              <div className="flex items-center gap-1">
                {item.trend && getTrendIcon(item.trend)}
                <span className="text-xs text-muted-foreground">{item.change}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-foreground">{item.value}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(item.targetPath)}
                className="text-primary hover:text-primary/80"
              >
                {item.actionText}
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
            {index < data.length - 1 && <div className="border-t border-border/50 pt-2" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}