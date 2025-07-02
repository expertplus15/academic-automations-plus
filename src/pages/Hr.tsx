import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { HrModuleSidebar } from '@/components/HrModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Calendar,
  TrendingUp,
  UserCheck,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function Hr() {
  const stats = [
    {
      label: "Enseignants actifs",
      value: "127",
      change: "+3",
      changeType: "positive" as const
    },
    {
      label: "Contrats en cours",
      value: "98",
      change: "+5%",
      changeType: "positive" as const
    },
    {
      label: "Disponibilités mises à jour",
      value: "89%",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "Évaluations complètes",
      value: "76%",
      change: "+8%",
      changeType: "positive" as const
    }
  ];

  const recentActivities = [
    {
      id: 1,
      teacher: "Dr. Marie Dubois",
      action: "Contrat renouvelé",
      status: "completed",
      date: "2024-01-15"
    },
    {
      id: 2,
      teacher: "Prof. Jean Martin",
      action: "Disponibilités mises à jour",
      status: "pending",
      date: "2024-01-14"
    },
    {
      id: 3,
      teacher: "Dr. Sophie Laurent",
      action: "Évaluation en cours",
      status: "progress",
      date: "2024-01-13"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Complété</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'progress':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><TrendingUp className="w-3 h-3 mr-1" />En cours</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <ModuleLayout sidebar={<HrModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header avec statistiques */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ressources Humaines</h1>
            <p className="text-muted-foreground text-lg mt-1">Gestion du personnel enseignant et administratif</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <UserCheck className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activités récentes */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Activités récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <UserCheck className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{activity.teacher}</p>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(activity.status)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {activity.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  Indicateurs de performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Graphiques de performance à venir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Ajouter un enseignant</p>
                      <p className="text-xs text-muted-foreground">Nouveau profil</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Gérer les contrats</p>
                      <p className="text-xs text-muted-foreground">Renouvellements</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Disponibilités</p>
                      <p className="text-xs text-muted-foreground">Planification</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-700">12 contrats à renouveler</p>
                  <p className="text-xs text-yellow-600">Échéance dans 30 jours</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-medium text-blue-700">8 évaluations en retard</p>
                  <p className="text-xs text-blue-600">À compléter</p>
                </div>

                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm font-medium text-green-700">Synchronisation RH</p>
                  <p className="text-xs text-green-600">Dernière mise à jour : aujourd'hui</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}