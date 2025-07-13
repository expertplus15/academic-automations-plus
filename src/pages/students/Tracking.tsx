import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  GraduationCap, 
  BookOpen, 
  Calendar,
  User,
  Target,
  Award,
  Search,
  Filter,
  Download
} from "lucide-react";
import { useState } from "react";

export default function Tracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("all");

  // Mock data pour le suivi académique
  const studentsTracking = [
    {
      id: "1",
      name: "Emma Dubois",
      studentNumber: "GC25001",
      program: "Informatique",
      level: "L1",
      semester: "S1",
      overallAverage: 15.2,
      attendanceRate: 92,
      creditsEarned: 24,
      creditsTotal: 30,
      progression: 80,
      status: "excellent",
      trend: "up",
      subjects: [
        { name: "Mathématiques", average: 16.5, credits: 6, status: "validated" },
        { name: "Programmation", average: 14.8, credits: 8, status: "validated" },
        { name: "Anglais", average: 13.2, credits: 4, status: "validated" },
        { name: "Physique", average: 16.8, credits: 6, status: "validated" }
      ],
      alerts: [],
      nextMilestone: "Examens finaux - 15 jours"
    },
    {
      id: "2",
      name: "Lucas Martin", 
      studentNumber: "GC25002",
      program: "Informatique",
      level: "L1",
      semester: "S1",
      overallAverage: 11.8,
      attendanceRate: 78,
      creditsEarned: 18,
      creditsTotal: 30,
      progression: 60,
      status: "warning",
      trend: "down",
      subjects: [
        { name: "Mathématiques", average: 8.5, credits: 0, status: "at_risk" },
        { name: "Programmation", average: 12.2, credits: 8, status: "validated" },
        { name: "Anglais", average: 14.1, credits: 4, status: "validated" },
        { name: "Physique", average: 12.8, credits: 6, status: "validated" }
      ],
      alerts: ["Mathématiques en échec", "Absentéisme élevé"],
      nextMilestone: "Rattrapage Mathématiques - 3 jours"
    }
  ];

  const stats = {
    totalStudents: studentsTracking.length,
    excellent: studentsTracking.filter(s => s.status === 'excellent').length,
    good: studentsTracking.filter(s => s.status === 'good').length,
    warning: studentsTracking.filter(s => s.status === 'warning').length,
    atRisk: studentsTracking.filter(s => s.status === 'at_risk').length,
    averageAttendance: Math.round(studentsTracking.reduce((acc, s) => acc + s.attendanceRate, 0) / studentsTracking.length),
    averageProgression: Math.round(studentsTracking.reduce((acc, s) => acc + s.progression, 0) / studentsTracking.length)
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      excellent: { variant: "default" as const, label: "Excellent", className: "bg-green-500" },
      good: { variant: "secondary" as const, label: "Bon", className: "bg-blue-500" },
      warning: { variant: "outline" as const, label: "Attention", className: "bg-yellow-500" },
      at_risk: { variant: "destructive" as const, label: "À risque", className: "bg-red-500" }
    };
    
    const config = variants[status as keyof typeof variants] || variants.good;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSubjectStatusColor = (status: string) => {
    switch (status) {
      case 'validated':
        return 'text-green-600';
      case 'at_risk':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredStudents = studentsTracking.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = programFilter === 'all' || student.program === programFilter;
    return matchesSearch && matchesProgram;
  });

  return (
    <StudentsModuleLayout 
      title="Suivi Académique" 
      subtitle="Suivi des performances et du parcours des étudiants"
    >
      <div className="p-6 space-y-6">
        {/* Statistiques générales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Étudiants</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
                <User className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Excellents</p>
                  <p className="text-2xl font-bold text-green-600">{stats.excellent}</p>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assiduité moy.</p>
                  <p className="text-2xl font-bold">{stats.averageAttendance}%</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Progression</p>
                  <p className="text-2xl font-bold">{stats.averageProgression}%</p>
                </div>
                <Target className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="individual">Suivi individuel</TabsTrigger>
              <TabsTrigger value="analytics">Analyses</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Répartition par statut */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Répartition des performances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.excellent}</div>
                    <div className="text-sm text-muted-foreground">Excellent</div>
                    <Progress value={(stats.excellent / stats.totalStudents) * 100} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.good}</div>
                    <div className="text-sm text-muted-foreground">Bon</div>
                    <Progress value={(stats.good / stats.totalStudents) * 100} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
                    <div className="text-sm text-muted-foreground">Attention</div>
                    <Progress value={(stats.warning / stats.totalStudents) * 100} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.atRisk}</div>
                    <div className="text-sm text-muted-foreground">À risque</div>
                    <Progress value={(stats.atRisk / stats.totalStudents) * 100} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            {/* Filtres */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher par nom ou numéro étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrer par programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les programmes</SelectItem>
                  <SelectItem value="Informatique">Informatique</SelectItem>
                  <SelectItem value="Gestion">Gestion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Liste des étudiants */}
            <div className="grid gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* En-tête étudiant */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{student.name}</h3>
                              {getStatusBadge(student.status)}
                              {getTrendIcon(student.trend)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{student.studentNumber}</span>
                              <span>{student.program} - {student.level}</span>
                              <span>Semestre {student.semester}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold">{student.overallAverage}/20</div>
                          <div className="text-sm text-muted-foreground">Moyenne générale</div>
                        </div>
                      </div>

                      {/* Métriques principales */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-xl font-semibold">{student.attendanceRate}%</div>
                          <div className="text-sm text-muted-foreground">Assiduité</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-xl font-semibold">{student.creditsEarned}/{student.creditsTotal}</div>
                          <div className="text-sm text-muted-foreground">Crédits ECTS</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-xl font-semibold">{student.progression}%</div>
                          <div className="text-sm text-muted-foreground">Progression</div>
                        </div>
                      </div>

                      {/* Matières */}
                      <div>
                        <h4 className="font-medium mb-3">Détail par matière</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {student.subjects.map((subject, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">{subject.name}</div>
                                <div className={`text-sm ${getSubjectStatusColor(subject.status)}`}>
                                  {subject.status === 'validated' ? 'Validée' : 
                                   subject.status === 'at_risk' ? 'À risque' : 'En cours'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{subject.average}/20</div>
                                <div className="text-sm text-muted-foreground">{subject.credits} ECTS</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Alertes et prochaine étape */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div>
                          {student.alerts.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {student.alerts.map((alert, idx) => (
                                <Badge key={idx} variant="destructive" className="text-xs">
                                  {alert}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-green-600">
                              Aucune alerte
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Prochaine étape:</div>
                          <div className="text-sm text-muted-foreground">{student.nextMilestone}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyses de performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Analyses avancées</h3>
                  <p>Graphiques et analyses détaillées en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentsModuleLayout>
  );
}