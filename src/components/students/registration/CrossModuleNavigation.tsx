import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Activity, 
  ArrowUpRight, 
  Clock,
  TrendingUp
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface CrossModuleNavigationProps {
  currentModule: 'dashboard' | 'analytics';
  insights?: {
    pendingActions?: number;
    conversionRate?: number;
    recentActivity?: number;
  };
}

export function CrossModuleNavigation({ currentModule, insights }: CrossModuleNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = currentModule === 'dashboard';
  const targetPath = isDashboard 
    ? '/students/registration/analytics' 
    : '/students/registration/dashboard';

  const targetModule = isDashboard ? 'Analytics' : 'Suivi Temps Réel';
  const currentModuleName = isDashboard ? 'Suivi Temps Réel' : 'Analytics';

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {isDashboard ? (
                <BarChart3 className="w-5 h-5 text-primary" />
              ) : (
                <Activity className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Basculer vers {targetModule}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isDashboard 
                  ? 'Voir les analyses détaillées et tendances'
                  : 'Retourner au suivi opérationnel en temps réel'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {insights && (
              <div className="text-right text-sm">
                {isDashboard ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {insights.conversionRate}% conversion
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">Taux excellent</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-yellow-600" />
                      <span className="text-yellow-600 font-medium">
                        {insights.pendingActions} en attente
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">Actions requises</p>
                  </div>
                )}
              </div>
            )}
            
            <Button 
              onClick={() => navigate(targetPath)}
              className="bg-primary hover:bg-primary/90"
            >
              Accéder
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}