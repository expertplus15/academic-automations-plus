
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ExamConflict } from '@/hooks/useExams';
import { getSeverityBadge } from '@/components/alerts/AlertsHelpers';

interface ExamConflictResolverProps {
  conflicts: ExamConflict[];
  loading: boolean;
  onResolveConflict: (conflictId: string, resolution: string) => void;
  onDetectConflicts: () => void;
}

export function ExamConflictResolver({ 
  conflicts, 
  loading, 
  onResolveConflict, 
  onDetectConflicts 
}: ExamConflictResolverProps) {
  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'room_overlap':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'supervisor_overlap':
        return <Clock className="w-4 h-4 text-red-500" />;
      case 'capacity_exceeded':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getConflictTypeLabel = (type: string) => {
    switch (type) {
      case 'room_overlap':
        return 'Conflit de Salle';
      case 'supervisor_overlap':
        return 'Conflit Surveillant';
      case 'capacity_exceeded':
        return 'Capacité Dépassée';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Résolution de Conflits ({conflicts.length})
          </CardTitle>
          <Button 
            variant="outline" 
            onClick={onDetectConflicts}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Analyser
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {conflicts.length === 0 ? (
          <Alert>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              Aucun conflit détecté. La planification est optimale !
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {conflicts.map((conflict, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getConflictIcon(conflict.conflict_type)}
                      <div>
                        <h4 className="font-semibold text-sm">{conflict.title}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {getConflictTypeLabel(conflict.conflict_type)}
                        </Badge>
                      </div>
                    </div>
                    {getSeverityBadge(conflict.severity)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {conflict.description}
                  </p>
                  
                  {conflict.affected_data && (
                    <div className="bg-muted/50 rounded p-2 mb-3 text-xs">
                      <strong>Éléments affectés:</strong>
                      <pre className="mt-1 overflow-auto">
                        {JSON.stringify(conflict.affected_data, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onResolveConflict(conflict.conflict_id, 'Manuel')}
                      disabled={loading}
                    >
                      Résoudre Manuellement
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => onResolveConflict(conflict.conflict_id, 'Automatique')}
                      disabled={loading}
                    >
                      Résolution Auto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
