
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Activity,
  TrendingUp,
  MessageSquare,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

export default function Students() {
  const stats = [
    {
      label: "Étudiants inscrits",
      value: "2,847",
      change: "+127",
      changeType: "positive" as const
    },
    {
      label: "Nouvelles inscriptions",
      value: "89",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "Taux de réussite",
      value: "94%",
      change: "+3%",
      changeType: "positive" as const
    },
    {
      label: "Documents traités",
      value: "156",
      change: "+24",
      changeType: "positive" as const
    }
  ];

  const recentActivities = [
    {
      id: 1,
      student: "Marie Dubois",
      action: "Inscription complétée",
      status: "completed",
      date: "2024-01-15"
    },
    {
      id: 2,
      student: "Jean Martin",
      action: "Documents en attente",
      status: "pending",
      date: "2024-01-14"
    },
    {
      id: 3,
      student: "Sophie Laurent",
      action: "Profil mis à jour",
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
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <StudentsModuleLayout>
        {/* Hero Section avec carte de fond */}
        <div className="relative overflow-hidden">
          {/* Carte de fond avec gradient emerald */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-12">
            <div className="max-w-6xl mx-auto relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Gestion des Étudiants</h1>
                  <p className="text-emerald-100 text-lg">Suivi et administration intelligente des étudiants</p>
                </div>
              </div>
              
              {/* Éléments décoratifs */}
              <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-20 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
            
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-6 relative z-10">
            {stats.map((stat, index) => (
                <Card key={index} className="bg-white rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className="p-3 bg-emerald-100 rounded-xl">
                        <Users className="w-6 h-6 text-emerald-600" />
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

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Activités récentes */}
              <Card className="bg-white rounded-2xl shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
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
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <Users className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{activity.student}</p>
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
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    Statistiques de performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
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
                      <UserPlus className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="font-medium">Nouvelle inscription</p>
                        <p className="text-xs text-muted-foreground">Ajouter un étudiant</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="font-medium">Suivi académique</p>
                        <p className="text-xs text-muted-foreground">Performances</p>
                      </div>
                    </div>
                  </button>

                  <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="font-medium">Communication</p>
                        <p className="text-xs text-muted-foreground">Messages & alertes</p>
                      </div>
                    </div>
                  </button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="bg-white rounded-2xl shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-emerald-500" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm font-medium text-blue-700">24 nouvelles inscriptions</p>
                    <p className="text-xs text-blue-600">En attente de validation</p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-700">12 documents manquants</p>
                    <p className="text-xs text-yellow-600">À compléter</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm font-medium text-green-700">Système de suivi actif</p>
                    <p className="text-xs text-green-600">Dernière synchronisation : maintenant</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </StudentsModuleLayout>
    </ProtectedRoute>
  );
}
