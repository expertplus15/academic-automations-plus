
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  CheckCircle,
  Search,
  Filter,
  Settings,
  TrendingDown,
  UserX,
  BookOpen
} from "lucide-react";

export function AlertsManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for alerts
  const alerts = [
    {
      id: "1",
      type: "attendance",
      severity: "critical",
      title: "Absentéisme critique",
      message: "Marie Dubois a dépassé le seuil d'absences autorisées (15 absences)",
      student: "Marie Dubois",
      studentNumber: "IG25001",
      subject: "Programmation Web",
      threshold: 10,
      currentValue: 15,
      createdAt: "2025-01-01T10:30:00Z",
      isActive: true,
      isRead: false
    },
    {
      id: "2",
      type: "grades",
      severity: "high",
      title: "Notes en baisse",
      message: "Jean Martin a une moyenne inférieure à 10/20 en Mathématiques",
      student: "Jean Martin",
      studentNumber: "IG25002",
      subject: "Mathématiques",
      threshold: 10,
      currentValue: 8.5,
      createdAt: "2025-01-01T09:15:00Z",
      isActive: true,
      isRead: false
    },
    {
      id: "3",
      type: "behavior",
      severity: "medium",
      title: "Comportement à surveiller",
      message: "Sophie Chen a eu 3 remarques disciplinaires ce mois-ci",
      student: "Sophie Chen",
      studentNumber: "IG25003",
      subject: null,
      threshold: 2,
      currentValue: 3,
      createdAt: "2025-01-01T08:45:00Z",
      isActive: true,
      isRead: true
    }
  ];

  const getSeverityBadge = (severity: string) => {
    const config = {
      critical: { label: "Critique", className: "bg-red-100 text-red-800 border-red-200" },
      high: { label: "Élevé", className: "bg-orange-100 text-orange-800 border-orange-200" },
      medium: { label: "Moyen", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      low: { label: "Faible", className: "bg-blue-100 text-blue-800 border-blue-200" }
    };
    
    const severityConfig = config[severity as keyof typeof config] || config.medium;
    return (
      <Badge className={severityConfig.className}>
        {severityConfig.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <UserX className="w-4 h-4" />;
      case "grades":
        return <TrendingDown className="w-4 h-4" />;
      case "behavior":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const activeAlerts = alerts.filter(alert => alert.isActive);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
  const unreadAlerts = activeAlerts.filter(alert => !alert.isRead);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alertes Critiques</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Actives</p>
                <p className="text-2xl font-bold">{activeAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Non Lues</p>
                <p className="text-2xl font-bold">{unreadAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Résolues (24h)</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-students" />
              Alertes Automatiques
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configuration
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par étudiant, matière ou type d'alerte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 border rounded-lg transition-colors ${
                !alert.isRead ? 'border-l-4 border-l-students bg-students/5' : 'border-border/50 hover:bg-muted/30'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-600' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {getTypeIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">{alert.title}</h3>
                      {getSeverityBadge(alert.severity)}
                      {!alert.isRead && (
                        <Badge variant="secondary" className="text-xs">
                          Nouveau
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {alert.message}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Étudiant: <strong>{alert.student}</strong></span>
                      <span>N°: {alert.studentNumber}</span>
                      {alert.subject && <span>Matière: {alert.subject}</span>}
                      <span>Seuil: {alert.threshold} | Actuel: {alert.currentValue}</span>
                      <span>{new Date(alert.createdAt).toLocaleDateString('fr-FR')} à {new Date(alert.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Voir Détails
                    </Button>
                    <Button variant="ghost" size="sm">
                      Marquer comme Lu
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Configuration Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-students" />
            Configuration des Alertes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <UserX className="w-4 h-4 text-red-600" />
                <h4 className="font-medium">Absentéisme</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Seuil: 10 absences par semestre
              </p>
              <p className="text-xs text-green-600">✓ Activé</p>
            </div>
            
            <div className="p-4 border border-border/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-orange-600" />
                <h4 className="font-medium">Notes en Baisse</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Seuil: Moyenne &lt; 10/20
              </p>
              <p className="text-xs text-green-600">✓ Activé</p>
            </div>
            
            <div className="p-4 border border-border/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium">Devoirs Non Rendus</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Seuil: 3 devoirs consécutifs
              </p>
              <p className="text-xs text-gray-500">⚪ Désactivé</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
