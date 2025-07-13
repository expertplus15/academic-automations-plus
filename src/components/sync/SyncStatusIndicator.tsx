import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Wifi,
  WifiOff 
} from 'lucide-react';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { useSyncTriggers } from '@/hooks/useSyncTriggers';

export function SyncStatusIndicator() {
  const { syncStatuses, loading, overallHealth, refresh } = useSyncStatus();
  const { triggerManualSync } = useSyncTriggers();

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return WifiOff;
      default: return Clock;
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'academic': return '🎓';
      case 'students': return '📚';
      case 'exams': return '📝';
      case 'results': return '📊';
      default: return '🔧';
    }
  };

  const getModuleLabel = (module: string) => {
    switch (module) {
      case 'academic': return 'Académique & Pédagogie';
      case 'students': return 'Gestion Étudiants';
      case 'exams': return 'Examens & Organisation';
      case 'results': return 'Évaluations & Résultats';
      default: return module;
    }
  };

  const HealthIcon = getHealthIcon(overallHealth);

  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HealthIcon className={`w-5 h-5 ${getHealthColor(overallHealth).split(' ')[0]}`} />
            <span>État de Synchronisation</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* État général */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
          <span className="font-medium">État général</span>
          <Badge className={getHealthColor(overallHealth)}>
            {overallHealth === 'healthy' && 'Synchronisé'}
            {overallHealth === 'warning' && 'Attention'}
            {overallHealth === 'critical' && 'Problème'}
            {overallHealth === 'unknown' && 'Inconnu'}
          </Badge>
        </div>

        {/* État par module */}
        <div className="space-y-2">
          {syncStatuses.map((status) => (
            <div 
              key={status.module}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{getModuleIcon(status.module)}</span>
                <div>
                  <div className="font-medium text-sm">{getModuleLabel(status.module)}</div>
                  <div className="text-xs text-muted-foreground">
                    {status.lastSync ? 
                      `Dernière sync: ${status.lastSync.toLocaleTimeString('fr-FR')}` : 
                      'Jamais synchronisé'
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {status.pendingOperations > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {status.pendingOperations}
                  </Badge>
                )}
                {status.failedOperations > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {status.failedOperations}
                  </Badge>
                )}
                {status.isConnected ? (
                  <Wifi className="w-4 h-4 text-green-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="pt-2 border-t border-border/50">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => triggerManualSync('all', 'full_sync', { triggered_at: new Date() })}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Synchroniser tous les modules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}