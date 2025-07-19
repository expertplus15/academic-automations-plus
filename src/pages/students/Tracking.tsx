
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";

export default function Tracking() {
  const academicStats = {
    totalStudents: 156,
    excellentPerformance: 45,
    needsAttention: 12,
    atRisk: 8
  };

  const performanceData = [
    {
      studentName: "Marie Dubois",
      studentNumber: "2024001",
      program: "DUT Informatique",
      semester: "S2",
      averageGrade: 16.5,
      attendance: 95,
      status: "excellent",
      lastUpdate: "Il y a 2 jours"
    },
    {
      studentName: "Jean Martin",
      studentNumber: "2024002", 
      program: "DUT GEA",
      semester: "S2",
      averageGrade: 11.2,
      attendance: 78,
      status: "attention",
      lastUpdate: "Il y a 1 jour"
    },
    {
      studentName: "Sarah Johnson",
      studentNumber: "2024003",
      program: "DUT GMP", 
      semester: "S2",
      averageGrade: 8.5,
      attendance: 65,
      status: "risk",
      lastUpdate: "Il y a 3 heures"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-success bg-success/10';
      case 'attention': return 'text-warning bg-warning/10';
      case 'risk': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'attention': return 'Attention';
      case 'risk': return 'À risque';
      default: return 'Normal';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return CheckCircle;
      case 'attention': return Clock;
      case 'risk': return AlertTriangle;
      default: return Activity;
    }
  };

  return (
    <StudentsModuleLayout 
      title="Suivi Académique" 
      subtitle="Monitoring des performances et progression des étudiants"
    >
      <div className="p-6 space-y-6">
        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Étudiants</p>
                  <p className="text-2xl font-bold">{academicStats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Performance Excellente</p>
                  <p className="text-2xl font-bold text-success">{academicStats.excellentPerformance}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Besoin d'Attention</p>
                  <p className="text-2xl font-bold text-warning">{academicStats.needsAttention}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">À Risque</p>
                  <p className="text-2xl font-bold text-destructive">{academicStats.atRisk}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions de Suivi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="justify-start">
                <Activity className="w-4 h-4 mr-2" />
                Rapport de suivi
              </Button>
              <Button variant="outline" className="justify-start">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Alertes automatiques
              </Button>
              <Button variant="outline" className="justify-start">
                <GraduationCap className="w-4 h-4 mr-2" />
                Plan d'accompagnement
              </Button>
              <Button variant="outline" className="justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Ressources pédagogiques
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tableau de suivi */}
        <Card>
          <CardHeader>
            <CardTitle>Suivi des Performances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((student, index) => {
                const StatusIcon = getStatusIcon(student.status);
                return (
                  <div key={index} 
                       className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <StatusIcon className={`w-6 h-6 ${getStatusColor(student.status).split(' ')[0]}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{student.studentName}</p>
                          <Badge 
                            variant="secondary" 
                            className={getStatusColor(student.status)}
                          >
                            {getStatusLabel(student.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {student.studentNumber} • {student.program} • {student.semester}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Mis à jour {student.lastUpdate}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">Moyenne</p>
                        <p className={`text-lg font-bold ${
                          student.averageGrade >= 14 ? 'text-success' : 
                          student.averageGrade >= 10 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {student.averageGrade}/20
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-medium">Assiduité</p>
                        <p className={`text-lg font-bold ${
                          student.attendance >= 90 ? 'text-success' : 
                          student.attendance >= 75 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {student.attendance}%
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Détails
                        </Button>
                        {student.status === 'risk' && (
                          <Button size="sm" className="bg-destructive hover:bg-destructive/90">
                            Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Indicateurs de performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Performances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Moyenne générale</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-success font-medium">+0.8 pts</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Taux de réussite</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-success font-medium">+5.2%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Assiduité moyenne</span>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-warning" />
                    <span className="text-warning font-medium">-2.1%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertes Automatiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium">8 étudiants à risque</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Moyenne &lt; 10/20 ou assiduité &lt; 70%
                  </p>
                </div>
                
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium">12 étudiants surveillés</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Performance en baisse ou absences répétées
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentsModuleLayout>
  );
}
