
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Users,
  Clock,
  MapPin,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function TimetableAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedProgram, setSelectedProgram] = useState('all');

  // Mock data for analytics
  const roomUsageData = [
    { name: 'A101', usage: 85, capacity: 100 },
    { name: 'A102', usage: 72, capacity: 80 },
    { name: 'B201', usage: 95, capacity: 120 },
    { name: 'B202', usage: 68, capacity: 90 },
    { name: 'C301', usage: 78, capacity: 100 },
    { name: 'Lab1', usage: 90, capacity: 30 },
  ];

  const weeklyHoursData = [
    { day: 'Lun', courses: 8, practical: 4, exams: 2 },
    { day: 'Mar', courses: 10, practical: 6, exams: 1 },
    { day: 'Mer', courses: 7, practical: 8, exams: 3 },
    { day: 'Jeu', courses: 9, practical: 5, exams: 2 },
    { day: 'Ven', courses: 6, practical: 3, exams: 4 },
    { day: 'Sam', courses: 2, practical: 1, exams: 1 },
  ];

  const subjectDistributionData = [
    { name: 'Mathématiques', value: 30, hours: 120 },
    { name: 'Informatique', value: 25, hours: 100 },
    { name: 'Physique', value: 20, hours: 80 },
    { name: 'Anglais', value: 15, hours: 60 },
    { name: 'Autres', value: 10, hours: 40 },
  ];

  const conflictTrendsData = [
    { week: 'S1', conflicts: 12, resolved: 10 },
    { week: 'S2', conflicts: 8, resolved: 8 },
    { week: 'S3', conflicts: 15, resolved: 13 },
    { week: 'S4', conflicts: 6, resolved: 6 },
    { week: 'S5', conflicts: 9, resolved: 8 },
    { week: 'S6', conflicts: 4, resolved: 4 },
  ];

  const teacherWorkloadData = [
    { name: 'Dr. Martin', hours: 18, efficiency: 92 },
    { name: 'Prof. Dubois', hours: 20, efficiency: 88 },
    { name: 'Dr. Leroy', hours: 16, efficiency: 95 },
    { name: 'Prof. Bernard', hours: 22, efficiency: 85 },
    { name: 'Dr. Moreau', hours: 14, efficiency: 90 },
  ];

  const keyMetrics = [
    {
      title: 'Taux d\'occupation',
      value: '78%',
      trend: '+5%',
      icon: <MapPin className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      title: 'Heures planifiées',
      value: '234h',
      trend: '+12h',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      title: 'Conflits résolus',
      value: '95%',
      trend: '+3%',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-orange-600'
    },
    {
      title: 'Étudiants impactés',
      value: '1,247',
      trend: '+89',
      icon: <Users className="h-4 w-4" />,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête et filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics des Emplois du Temps
            </CardTitle>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semaine</SelectItem>
                  <SelectItem value="month">Mois</SelectItem>
                  <SelectItem value="semester">Semestre</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les programmes</SelectItem>
                  <SelectItem value="info">Informatique</SelectItem>
                  <SelectItem value="math">Mathématiques</SelectItem>
                  <SelectItem value="physics">Physique</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Rapport
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className={`text-sm ${metric.color}`}>
                      {metric.trend}
                    </span>
                  </div>
                </div>
                <div className={metric.color}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Onglets d'analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="rooms">Utilisation Salles</TabsTrigger>
          <TabsTrigger value="teachers">Charge Enseignants</TabsTrigger>
          <TabsTrigger value="conflicts">Gestion Conflits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition hebdomadaire */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Répartition Hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyHoursData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="courses" stackId="a" fill="#0088FE" name="Cours" />
                    <Bar dataKey="practical" stackId="a" fill="#00C49F" name="TP" />
                    <Bar dataKey="exams" stackId="a" fill="#FF8042" name="Examens" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribution des matières */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribution des Matières</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subjectDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {subjectDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Taux d'Occupation des Salles</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={roomUsageData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Occupation']} />
                  <Bar dataKey="usage" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Charge de Travail des Enseignants</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={teacherWorkloadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="hours" fill="#0088FE" name="Heures/semaine" />
                  <Bar yAxisId="right" dataKey="efficiency" fill="#00C49F" name="Efficacité %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Évolution des Conflits</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={conflictTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="conflicts" stroke="#FF8042" name="Conflits détectés" />
                  <Line type="monotone" dataKey="resolved" stroke="#00C49F" name="Conflits résolus" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
