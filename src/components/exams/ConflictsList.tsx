import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Bot, RefreshCw } from 'lucide-react';
import { useExamConflictDetection } from '@/hooks/useExamConflictDetection';

export function ConflictsList() {
  const { conflicts, loading, detectConflicts } = useExamConflictDetection();

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critique</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Élevé</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Moyen</Badge>;
      default:
        return <Badge variant="secondary">Faible</Badge>;
    }
  };

  const getSeverityIcon = (severity: string) => {
    return (
      <div className={`w-3 h-3 rounded-full ${
        severity === 'critical' ? 'bg-red-500' :
        severity === 'high' ? 'bg-orange-500' :
        severity === 'medium' ? 'bg-yellow-500' :
        'bg-gray-500'
      }`} />
    );
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Conflits détectés par l'IA ({conflicts.length})
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => detectConflicts()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Détection des conflits...</span>
          </div>
        ) : conflicts.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-center">
            <div>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-muted-foreground">Aucun conflit détecté</p>
              <p className="text-sm text-muted-foreground">Tous les examens sont correctement planifiés</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {conflicts.slice(0, 5).map((conflict, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-4">
                  {getSeverityIcon(conflict.severity)}
                  <div>
                    <p className="font-medium text-foreground">{conflict.title}</p>
                    <p className="text-sm text-muted-foreground">{conflict.description}</p>
                    <p className="text-xs text-muted-foreground capitalize">{conflict.conflict_type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(conflict.severity)}
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Bot className="w-3 h-3 mr-1" />
                    Auto-résoudre
                  </Button>
                </div>
              </div>
            ))}
            {conflicts.length > 5 && (
              <div className="text-center pt-4">
                <Button variant="outline">
                  Voir tous les conflits ({conflicts.length - 5} restants)
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}