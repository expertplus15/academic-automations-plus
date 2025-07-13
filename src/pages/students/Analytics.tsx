import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  GraduationCap, 
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Filter
} from "lucide-react";
import { useState } from "react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("this_month");
  const [programFilter, setProgramFilter] = useState("all");

  // Mock data pour les analytics
  const overviewStats = {
    totalStudents: 2,
    newEnrollments: 0,
    retentionRate: 100,
    averageGrade: 13.5,
    attendanceRate: 85,
    graduationRate: 92,
    activeAlerts: 3,
    documentsGenerated: 5
  };

  const programStats = [
    {
      name: "Informatique",
      students: 2,
      retention: 100,
      averageGrade: 13.5,
      trend: "stable"
    },
    {
      name: "Gestion",
      students: 0,
      retention: 0,
      averageGrade: 0,
      trend: "stable"
    }
  ];

  const monthlyTrends = [
    { month: "Sept 2024", enrollments: 0, graduations: 0, alerts: 0 },
    { month: "Oct 2024", enrollments: 0, graduations: 0, alerts: 1 },
    { month: "Nov 2024", enrollments: 1, graduations: 0, alerts: 2 },
    { month: "Déc 2024", enrollments: 1, graduations: 0, alerts: 1 },
    { month: "Jan 2025", enrollments: 0, graduations: 0, alerts: 3 }
  ];

  const performanceMetrics = [
    {
      category: "Académique",
      metrics: [
        { name: "Note moyenne générale", value: "13.5/20", trend: "up", color: "text-green-600" },
        { name: "Taux de réussite", value: "85%", trend: "up", color: "text-green-600" },
        { name: "Crédits ECTS moyens", value: "21/30", trend: "stable", color: "text-blue-600" },
        { name: "Nombre d'échecs", value: "1", trend: "down", color: "text-red-600" }
      ]
    },
    {
      category: "Assiduité",
      metrics: [
        { name: "Taux de présence", value: "85%", trend: "down", color: "text-yellow-600" },
        { name: "Absences injustifiées", value: "8", trend: "up", color: "text-red-600" },
        { name: "Retards", value: "3", trend: "stable", color: "text-blue-600" },
        { name: "Justificatifs manquants", value: "2", trend: "stable", color: "text-yellow-600" }
      ]
    },
    {
      category: "Engagement",
      metrics: [
        { name: "Participation cours", value: "78%", trend: "up", color: "text-green-600" },
        { name: "Devoirs rendus", value: "92%", trend: "up", color: "text-green-600" },
        { name: "Projets complétés", value: "100%", trend: "stable", color: "text-green-600" },
        { name: "Activités extra-scolaires", value: "40%", trend: "up", color: "text-blue-600" }
      ]
    }
  ];

  const riskAnalysis = [
    {
      level: "Critique",
      count: 0,
      percentage: 0,
      color: "bg-red-500",
      description: "Risque de décrochage imminent"
    },
    {
      level: "Élevé", 
      count: 1,
      percentage: 50,
      color: "bg-orange-500",
      description: "Surveillance renforcée requise"
    },
    {
      level: "Modéré",
      count: 0,
      percentage: 0,
      color: "bg-yellow-500",
      description: "Attention particulière"
    },
    {
      level: "Faible",
      count: 1,
      percentage: 50,
      color: "bg-green-500",
      description: "Situation normale"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  return (
    <StudentsModuleLayout 
      title="Analytics Étudiants" 
      subtitle="Analyses et métriques de performance du module étudiants"
    >
      <div className="p-6 space-y-6">
        {/* Contrôles et filtres */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_week">Cette semaine</SelectItem>
                <SelectItem value="this_month">Ce mois</SelectItem>
                <SelectItem value="this_semester">Ce semestre</SelectItem>
                <SelectItem value="this_year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Programme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les programmes</SelectItem>
                <SelectItem value="informatique">Informatique</SelectItem>
                <SelectItem value="gestion">Gestion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Étudiants totaux</p>
                  <p className="text-2xl font-bold">{overviewStats.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Note moyenne</p>
                  <p className="text-2xl font-bold">{overviewStats.averageGrade}/20</p>
                </div>
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assiduité</p>
                  <p className="text-2xl font-bold">{overviewStats.attendanceRate}%</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alertes actives</p>
                  <p className="text-2xl font-bold text-red-600">{overviewStats.activeAlerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="risks">Analyse des risques</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Répartition par programme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Répartition par programme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programStats.map((program, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <h4 className="font-medium">{program.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {program.students} étudiants • Rétention: {program.retention}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{program.averageGrade}/20</div>
                        <div className="text-sm text-muted-foreground">Moyenne</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Métriques clés */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Taux de rétention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{overviewStats.retentionRate}%</div>
                      <p className="text-sm text-muted-foreground">Étudiants actifs</p>
                    </div>
                    <Progress value={overviewStats.retentionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Taux de diplomation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{overviewStats.graduationRate}%</div>
                      <p className="text-sm text-muted-foreground">Sur les 3 dernières années</p>
                    </div>
                    <Progress value={overviewStats.graduationRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6">
              {performanceMetrics.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {category.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{metric.name}</div>
                            <div className={`text-sm ${metric.color}`}>{metric.value}</div>
                          </div>
                          {getTrendIcon(metric.trend)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyTrends.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="font-medium">{month.month}</div>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Inscriptions: </span>
                          <span className="font-medium">{month.enrollments}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Diplômés: </span>
                          <span className="font-medium">{month.graduations}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Alertes: </span>
                          <span className="font-medium text-red-600">{month.alerts}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Analyse des risques de décrochage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAnalysis.map((risk, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${risk.color}`}></div>
                        <div>
                          <div className="font-medium">Risque {risk.level}</div>
                          <div className="text-sm text-muted-foreground">{risk.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{risk.count}</div>
                        <div className="text-sm text-muted-foreground">{risk.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Facteurs de risque identifiés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="font-medium">Absences répétées en Mathématiques</span>
                    </div>
                    <Badge variant="destructive">1 étudiant</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">Note en dessous de la moyenne</span>
                    </div>
                    <Badge variant="outline">1 étudiant</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Progression normale</span>
                    </div>
                    <Badge variant="outline" className="text-green-600">1 étudiant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentsModuleLayout>
  );
}