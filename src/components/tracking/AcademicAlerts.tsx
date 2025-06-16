
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye, Clock } from "lucide-react";
import { useAcademicAlerts } from "@/hooks/useAcademicAlerts";

export function AcademicAlerts() {
  const { alerts, loading, markAsRead } = useAcademicAlerts({ 
    is_active: true 
  });

  const recentAlerts = alerts.slice(0, 5);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'low_grade': return 'Note faible';
      case 'excessive_absences': return 'Absences excessives';
      case 'failing_subject': return 'Échec matière';
      case 'attendance_drop': return 'Chute assiduité';
      case 'at_risk': return 'Risque d\'échec';
      default: return type;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertes Académiques</CardTitle>
          <CardDescription>Alertes récentes et notifications importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3 p-3 border rounded">
                <div className="h-4 w-4 bg-muted rounded"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertes Académiques
        </CardTitle>
        <CardDescription>
          Alertes récentes et notifications importantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentAlerts.length === 0 ? (
          <div className="text-center py-6">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune alerte récente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`flex items-start justify-between p-3 border rounded-lg ${
                  !alert.is_read ? 'bg-muted/50 border-l-4 border-l-orange-500' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline">
                      {getAlertTypeLabel(alert.alert_type)}
                    </Badge>
                    {!alert.is_read && (
                      <Badge variant="secondary" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Non lue
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Étudiant: {alert.students?.profiles?.full_name}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {!alert.is_read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead(alert.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        {alerts.length > 5 && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm">
              Voir toutes les alertes ({alerts.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
