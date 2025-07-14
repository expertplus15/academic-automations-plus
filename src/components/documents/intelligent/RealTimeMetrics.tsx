import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, TrendingUp, Clock, Archive, FileSignature } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MetricData {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  trend?: string;
  color: string;
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      value: "15,678",
      label: "Documents totaux",
      icon: Archive,
      trend: "+234 ce mois",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      value: "45",
      label: "Templates actifs",
      icon: FileText,
      trend: "+3 nouveaux",
      color: "text-green-600 dark:text-green-400"
    },
    {
      value: "156",
      label: "Signatures en attente",
      icon: FileSignature,
      trend: "-12 aujourd'hui",
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      value: "98.5%",
      label: "Disponibilité système",
      icon: TrendingUp,
      trend: "Excellent",
      color: "text-emerald-600 dark:text-emerald-400"
    },
    {
      value: "2.3s",
      label: "Temps de génération moyen",
      icon: Clock,
      trend: "-0.5s ce mois",
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      value: "247",
      label: "Utilisateurs actifs",
      icon: Users,
      trend: "+18 cette semaine",
      color: "text-pink-600 dark:text-pink-400"
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates with actual data fetching
    const fetchMetrics = async () => {
      try {
        // This would be replaced with actual Supabase edge function call
        // const { data } = await supabase.functions.invoke('get-dashboard-stats');
        
        // For now, simulate real-time updates
        setMetrics(prev => prev.map(metric => ({
          ...metric,
          value: metric.label.includes('Documents') 
            ? (15678 + Math.floor(Math.random() * 10)).toLocaleString()
            : metric.value
        })));
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    // Initial fetch
    fetchMetrics();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);

    // Supabase realtime subscription for document changes
    const channel = supabase
      .channel('dashboard-metrics')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'generated_documents' },
        () => fetchMetrics()
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-background/80 border-border/50 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              {metric.trend && (
                <Badge 
                  variant="outline" 
                  className="text-xs px-1.5 py-0.5 h-auto bg-muted/50"
                >
                  {metric.trend}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <div className={`text-lg font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground leading-tight">
                {metric.label}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}