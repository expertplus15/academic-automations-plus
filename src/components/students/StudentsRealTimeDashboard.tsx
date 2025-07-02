import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  TrendingUp,
  Calendar,
  BarChart3
} from "lucide-react";
import { useStudentsDashboard } from "@/hooks/useStudentsDashboard";

export function StudentsRealTimeDashboard() {
  const { stats, recentEnrollments, programDistribution, loading, error, refreshData } = useStudentsDashboard();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-students/10 text-students border-students/20">Actif</Badge>;
      case "pending":
        return <Badge variant="secondary">En cours</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-students" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "suspended":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Il y a moins d'1h";
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                      <div className="h-6 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={refreshData} className="mt-2">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Statistics Cards - Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg hover-scale transition-all duration-300 border-students/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-students/10 rounded-lg">
                <Users className="w-5 h-5 text-students" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Étudiants</p>
                <p className="text-2xl font-bold text-students">{stats.totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover-scale transition-all duration-300 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nouveaux (ce mois)</p>
                <p className="text-2xl font-bold text-green-600">{stats.newThisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover-scale transition-all duration-300 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Étudiants Actifs</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover-scale transition-all duration-300 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux de rétention</p>
                <p className="text-2xl font-bold text-purple-600">{stats.retentionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics - Real Data */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-students" />
                Performance d'Inscription
              </CardTitle>
              <CardDescription>Temps moyen actuel: {stats.averageEnrollmentTime}s</CardDescription>
            </div>
            <Badge className="bg-students/10 text-students">
              🎯 &lt; 30 secondes
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Performance actuelle</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full">
                  <div 
                    className="h-full bg-students rounded-full"
                    style={{ width: `${Math.min((30 - stats.averageEnrollmentTime) / 30 * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{stats.averageEnrollmentTime}s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Enrollments - Real Data */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-students" />
                Inscriptions Récentes
              </CardTitle>
              <CardDescription>
                {recentEnrollments.length} inscriptions récentes
              </CardDescription>
            </div>
            <Button onClick={refreshData} variant="outline" size="sm">
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEnrollments.length > 0 ? (
              recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:bg-muted/30 hover:shadow-md transition-all duration-200 animate-fade-in">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(enrollment.status)}
                    <div>
                      <p className="font-medium text-foreground">{enrollment.full_name}</p>
                      <p className="text-sm text-muted-foreground">{enrollment.student_number}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{enrollment.program_name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(enrollment.created_at)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(enrollment.status)}
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Aucune inscription récente</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Program Distribution - Real Data */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle>Répartition par Programme</CardTitle>
          <CardDescription>Distribution des {stats.activeStudents} étudiants actifs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {programDistribution.length > 0 ? (
              programDistribution.map((program, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{program.program_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{program.student_count} étudiants</span>
                    <Badge variant="outline">{program.percentage}%</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Aucune donnée de programme disponible</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}