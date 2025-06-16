
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Clock, MapPin } from 'lucide-react';
import { keyMetrics } from './analyticsData';

const iconMap = {
  'Taux d\'occupation': <MapPin className="h-4 w-4" />,
  'Heures planifiées': <Clock className="h-4 w-4" />,
  'Conflits résolus': <TrendingUp className="h-4 w-4" />,
  'Étudiants impactés': <Users className="h-4 w-4" />,
};

export function AnalyticsMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {keyMetrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className={`text-sm ${metric.color}`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
              <div className={metric.color}>
                {iconMap[metric.title as keyof typeof iconMap]}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
