
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, X } from "lucide-react";

export function AcademicAlerts() {
  const alerts = [
    {
      id: 1,
      type: "low_grade",
      severity: "high",
      student: "Marie Dubois",
      message: "Moyenne inférieure à 8/20 en Mathématiques",
      created: "Il y a 2 heures"
    },
    {
      id: 2,
      type: "excessive_absences",
      severity: "critical",
      student: "Jean Martin",
      message: "Taux d'absence de 35% dépassé",
      created: "Il y a 1 jour"
    },
    {
      id: 3,
      type: "at_risk",
      severity: "medium",
      student: "Sophie Chen",
      message: "Risque d'échec détecté par l'IA",
      created: "Il y a 3 jours"
    }
  ];

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: <Badge className="bg-blue-100 text-blue-800">Faible</Badge>,
      medium: <Badge className="bg-yellow-100 text-yellow-800">Moyen</Badge>,
      high: <Badge className="bg-orange-100 text-orange-800">Élevé</Badge>,
      critical: <Badge variant="destructive">Critique</Badge>
    };
    return variants[severity as keyof typeof variants] || variants.medium;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_grade":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "excessive_absences":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "at_risk":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertes Académiques</CardTitle>
        <CardDescription>
          Notifications importantes nécessitant une attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg">
              <div className="mt-1">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{alert.student}</span>
                  {getSeverityBadge(alert.severity)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.created}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
