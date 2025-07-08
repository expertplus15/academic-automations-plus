import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { HrModuleSidebar } from '@/components/HrModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp,
  Users,
  Star,
  Calendar,
  Award,
  Target,
  Clock,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useTeacherProfiles } from '@/hooks/hr/useTeacherProfiles';
import { useTeacherContracts } from '@/hooks/hr/useTeacherContracts';
import { useToast } from '@/hooks/use-toast';

export default function Analytics() {
  const { teacherProfiles } = useTeacherProfiles();
  const { contracts } = useTeacherContracts();
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { toast } = useToast();

  // Données factices pour les performances
  const performanceData = [
    { month: 'Jan', score: 85, evaluations: 12 },
    { month: 'Fév', score: 88, evaluations: 15 },
    { month: 'Mar', score: 87, evaluations: 18 },
    { month: 'Avr', score: 90, evaluations: 14 },
    { month: 'Mai', score: 89, evaluations: 16 },
    { month: 'Jun', score: 92, evaluations: 20 }
  ];

  const skillsDistribution = [
    { name: 'Pédagogie', value: 35, color: '#f59e0b' },
    { name: 'Expertise', value: 25, color: '#3b82f6' },
    { name: 'Relations', value: 20, color: '#10b981' },
    { name: 'Administration', value: 20, color: '#8b5cf6' }
  ];

  const contractTypes = [
    { type: 'CDI', count: 45, percentage: 60 },
    { type: 'CDD', count: 20, percentage: 27 },
    { type: 'Vacataire', count: 10, percentage: 13 }
  ];

  const experienceDistribution = [
    { range: '0-2 ans', count: 15 },
    { range: '3-5 ans', count: 22 },
    { range: '6-10 ans', count: 25 },
    { range: '11-15 ans', count: 18 },
    { range: '15+ ans', count: 12 }
  ];

  const departmentStats = [
    { name: 'Informatique', teachers: 25, avgScore: 88, satisfaction: 92 },
    { name: 'Mathématiques', teachers: 18, avgScore: 85, satisfaction: 89 },
    { name: 'Physique', teachers: 15, avgScore: 90, satisfaction: 94 },
    { name: 'Chimie', teachers: 12, avgScore: 87, satisfaction: 91 }
  ];

  const stats = [
    {
      label: "Score moyen global",
      value: "88.5%",
      change: "+2.3%",
      changeType: "positive",
      icon: TrendingUp
    },
    {
      label: "Taux de satisfaction",
      value: "91.2%",
      change: "+1.8%", 
      changeType: "positive",
      icon: Star
    },
    {
      label: "Évaluations complétées",
      value: "95/98",
      change: "97%",
      changeType: "positive",
      icon: Target
    },
    {
      label: "Objectifs atteints",
      value: "87%",
      change: "+4.2%",
      changeType: "positive",
      icon: Award
    }
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <ModuleLayout sidebar={<HrModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics RH</h1>
            <p className="text-muted-foreground mt-1">Tableau de bord des performances et indicateurs</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline"
              onClick={() => toast({
                title: "Export en cours",
                description: "Téléchargement du rapport Analytics RH en PDF...",
              })}
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => toast({
                title: "Données actualisées",
                description: "Les données Analytics ont été mises à jour avec succès",
              })}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="distribution">Répartition</TabsTrigger>
            <TabsTrigger value="departments">Départements</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white rounded-2xl shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-500" />
                    Évolution des Performances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#f59e0b" 
                        fill="#fef3c7" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-2xl shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-amber-500" />
                    Répartition des Compétences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={skillsDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`}
                      >
                        {skillsDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle>Indicateurs de Performance Détaillés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pédagogie</span>
                      <span className="text-sm text-muted-foreground">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Expertise Technique</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Relations Étudiants</span>
                      <span className="text-sm text-muted-foreground">86%</span>
                    </div>
                    <Progress value={86} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Développement Pro</span>
                      <span className="text-sm text-muted-foreground">84%</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white rounded-2xl shadow-sm border-0">
                <CardHeader>
                  <CardTitle>Types de Contrats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contractTypes.map((contract, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                          <span className="font-medium">{contract.type}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{contract.count}</span>
                          <span className="text-sm text-muted-foreground ml-2">({contract.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-2xl shadow-sm border-0">
                <CardHeader>
                  <CardTitle>Répartition par Expérience</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={experienceDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle>Performance par Département</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept, index) => (
                    <div key={index} className="p-4 border border-border/50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">{dept.name}</h3>
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                          {dept.teachers} enseignants
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Score moyen</p>
                          <div className="flex items-center gap-2">
                            <Progress value={dept.avgScore} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{dept.avgScore}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Satisfaction</p>
                          <div className="flex items-center gap-2">
                            <Progress value={dept.satisfaction} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{dept.satisfaction}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle>Tendances Temporelles</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="evaluations" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}