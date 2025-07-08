
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useStudentsDashboard } from '@/hooks/useStudentsDashboard';
import { useAuth } from '@/hooks/useAuth';
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
  const { hasRole, isAdmin, isHR } = useAuth();
  const { stats, recentEnrollments, programDistribution, loading, error } = useStudentsDashboard();

  // Access control for different roles
  const canCreateStudents = hasRole(['admin', 'hr']);
  const canViewAllStudents = hasRole(['admin', 'hr', 'teacher']);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr']}>
        <StudentsModuleLayout>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner size="lg" />
          </div>
        </StudentsModuleLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr']}>
        <StudentsModuleLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-foreground font-semibold mb-2">Erreur de chargement</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </StudentsModuleLayout>
      </ProtectedRoute>
    );
  }

  const dashboardStats = [
    {
      label: "Étudiants inscrits",
      value: stats.totalStudents.toString(),
      change: `+${stats.newThisMonth}`,
      changeType: "positive" as const
    },
    {
      label: "Nouvelles inscriptions",
      value: stats.newThisMonth.toString(),
      change: stats.newThisMonth > 0 ? "+12%" : "0%",
      changeType: "positive" as const
    },
    {
      label: "Taux de rétention",
      value: `${stats.retentionRate}%`,
      change: "+3%",
      changeType: "positive" as const
    },
    {
      label: "Étudiants actifs",
      value: stats.activeStudents.toString(),
      change: `+${Math.round(stats.activeStudents * 0.05)}`,
      changeType: "positive" as const
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
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr']}>
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
            {dashboardStats.map((stat, index) => (
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
                    {recentEnrollments.length > 0 ? recentEnrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <Users className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{enrollment.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {enrollment.student_number} - {enrollment.program_name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(enrollment.status)}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(enrollment.enrollment_date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Aucune inscription récente</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Program Distribution */}
              <Card className="bg-white rounded-2xl shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    Répartition par Programme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {programDistribution.length > 0 ? programDistribution.map((program, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                        <div>
                          <p className="font-medium text-foreground">{program.program_name}</p>
                          <p className="text-sm text-muted-foreground">{program.student_count} étudiants</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{program.percentage}%</Badge>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Aucune donnée de répartition</p>
                      </div>
                    )}
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
                  {canCreateStudents && (
                    <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <UserPlus className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="font-medium">Nouvelle inscription</p>
                          <p className="text-xs text-muted-foreground">Ajouter un étudiant</p>
                        </div>
                      </div>
                    </button>
                  )}
                  
                  {canViewAllStudents && (
                    <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="font-medium">Suivi académique</p>
                          <p className="text-xs text-muted-foreground">Performances</p>
                        </div>
                      </div>
                    </button>
                  )}

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
                    <p className="text-sm font-medium text-blue-700">{stats.newThisMonth} nouvelles inscriptions</p>
                    <p className="text-xs text-blue-600">Ce mois-ci</p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-700">{stats.pendingEnrollments} documents en attente</p>
                    <p className="text-xs text-yellow-600">À traiter</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm font-medium text-green-700">Taux de rétention: {stats.retentionRate}%</p>
                    <p className="text-xs text-green-600">Performance académique</p>
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
