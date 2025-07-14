import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  TrendingUp,
  Users,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Activity {
  id: string;
  time: string;
  action: string;
  user: string;
  status: 'success' | 'warning' | 'info' | 'error';
  category: 'generation' | 'template' | 'signature' | 'system';
  details?: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      time: "14:30",
      action: "Template bulletin généré avec IA",
      user: "Système auto",
      status: "success",
      category: "generation",
      details: "Bulletin S1 - 234 étudiants"
    },
    {
      id: '2',
      time: "14:15",
      action: "Signature électronique validée",
      user: "M. Directeur",
      status: "success",
      category: "signature",
      details: "Certificat de scolarité - Marie Dupont"
    },
    {
      id: '3',
      time: "13:45",
      action: "Archive document étudiant",
      user: "Secrétariat",
      status: "info",
      category: "system",
      details: "Document stocké dans Archives/2024"
    },
    {
      id: '4',
      time: "13:30",
      action: "Template modifié avec optimisations",
      user: "Admin documents",
      status: "warning",
      category: "template",
      details: "Performance améliorée de 23%"
    },
    {
      id: '5',
      time: "13:15",
      action: "Génération en masse terminée",
      user: "Système IA",
      status: "success",
      category: "generation",
      details: "156 attestations générées"
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Set up real-time activity feed
    const channel = supabase
      .channel('activity-feed')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'generated_documents' },
        (payload) => {
          // Add new activity when document is generated
          const newActivity: Activity = {
            id: Date.now().toString(),
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            action: "Nouveau document généré",
            user: "Système",
            status: "success",
            category: "generation",
            details: `Document ID: ${(payload.new as any)?.id || 'N/A'}`
          };
          
          setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const refreshActivities = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'warning': return <AlertCircle className="w-3 h-3 text-orange-500" />;
      case 'error': return <AlertCircle className="w-3 h-3 text-red-500" />;
      default: return <Info className="w-3 h-3 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'generation': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'template': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'signature': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'system': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
      default: return 'bg-muted';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'generation': return FileText;
      case 'template': return TrendingUp;
      case 'signature': return CheckCircle;
      case 'system': return Users;
      default: return Info;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            Activité Temps Réel
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshActivities}
            disabled={isRefreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity) => {
          const CategoryIcon = getCategoryIcon(activity.category);
          return (
            <div key={activity.id} className="flex items-start gap-3 group hover:bg-accent/30 p-2 rounded-lg transition-colors -mx-2">
              <div className="text-xs text-muted-foreground mt-1 w-12 flex-shrink-0">
                {activity.time}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {activity.action}
                  </p>
                  {getStatusIcon(activity.status)}
                </div>
                
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs h-5 ${getCategoryColor(activity.category)}`}
                  >
                    <CategoryIcon className="w-3 h-3 mr-1" />
                    {activity.category}
                  </Badge>
                </div>
                
                {activity.details && (
                  <p className="text-xs text-muted-foreground/80 italic">
                    {activity.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 pt-3 border-t border-border/50">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Flux en temps réel</span>
        </div>
      </CardContent>
    </Card>
  );
}