import React from 'react';
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Alerts() {
  const alerts = [
    {
      id: 1,
      type: "attendance",
      severity: "high",
      title: "Absentéisme élevé",
      description: "Jean Dupont - 15 absences ce mois",
      timestamp: "Il y a 2 heures",
      status: "active"
    },
    {
      id: 2,
      type: "grades",
      severity: "medium", 
      title: "Note en dessous du seuil",
      description: "Marie Martin - Moyenne: 8.5/20 en Mathématiques",
      timestamp: "Il y a 4 heures",
      status: "active"
    },
    {
      id: 3,
      type: "documents",
      severity: "low",
      title: "Documents manquants",
      description: "5 étudiants - Certificats médicaux en attente",
      timestamp: "Il y a 1 jour",
      status: "resolved"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <StudentsModuleLayout 
      title="Alertes et Notifications" 
      subtitle="Suivi des alertes importantes concernant les étudiants"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes Actives</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">8</div>
              <p className="text-xs text-muted-foreground">Nécessitent une action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Cours</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">12</div>
              <p className="text-xs text-muted-foreground">En traitement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Résolues</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">45</div>
              <p className="text-xs text-muted-foreground">Cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de résolution</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">+5% ce mois</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alertes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      alert.severity === 'high' ? 'bg-destructive/10 text-destructive' :
                      alert.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                      'bg-secondary/10 text-secondary-foreground'
                    }`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{alert.title}</h3>
                        <Badge variant={getSeverityColor(alert.severity) as any}>
                          {alert.severity}
                        </Badge>
                        {alert.status === 'resolved' && (
                          <Badge variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Résolu
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                  {alert.status === 'active' && (
                    <Button variant="outline" size="sm">
                      Traiter
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}