
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  RefreshCw
} from "lucide-react";

export default function RegistrationDashboard() {
  const realtimeStats = {
    activeApplications: 8,
    completedToday: 5,
    pendingReview: 12,
    averageTime: "2.5h"
  };

  const recentActivity = [
    {
      id: 1,
      type: "new",
      message: "Nouvelle demande d'inscription",
      student: "Marie Dubois",
      program: "DUT Informatique",
      time: "Il y a 15 min",
      status: "pending"
    },
    {
      id: 2,
      type: "approved",
      message: "Inscription approuvée",
      student: "Jean Martin",
      program: "DUT GEA",
      time: "Il y a 32 min",
      status: "approved"
    },
    {
      id: 3,
      type: "document",
      message: "Documents manquants signalés",
      student: "Sarah Johnson",
      program: "DUT GMP",
      time: "Il y a 1h",
      status: "warning"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-warning';
      case 'approved': return 'text-success';
      case 'warning': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'new': return Clock;
      case 'approved': return CheckCircle;
      case 'document': return AlertTriangle;
      default: return Activity;
    }
  };

  return (
    <StudentsModuleLayout 
      title="Suivi Temps Réel" 
      subtitle="Tableau de bord opérationnel des inscriptions en cours"
    >
      <div className="p-6 space-y-6">
        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Dernière mise à jour: il y a 2 min</span>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Statistiques temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En cours</p>
                  <p className="text-2xl font-bold text-primary">{realtimeStats.activeApplications}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Finalisées aujourd'hui</p>
                  <p className="text-2xl font-bold text-success">{realtimeStats.completedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-warning">{realtimeStats.pendingReview}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-info">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Temps moyen</p>
                  <p className="text-2xl font-bold text-info">{realtimeStats.averageTime}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activité en Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const IconComponent = getStatusIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
                    <div className="flex-shrink-0">
                      <IconComponent className={`w-5 h-5 ${getStatusColor(activity.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{activity.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.student} - {activity.program}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      <Badge 
                        variant={activity.status === 'approved' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {activity.status === 'pending' && 'En cours'}
                        {activity.status === 'approved' && 'Approuvé'}
                        {activity.status === 'warning' && 'Attention'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions Urgentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  12 dossiers nécessitent une attention
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  8 inscriptions dépassent 24h
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raccourcis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Voir toutes les inscriptions
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Planifier les entretiens
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentsModuleLayout>
  );
}
