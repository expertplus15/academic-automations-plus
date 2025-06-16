
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  roomUsageData,
  weeklyHoursData,
  subjectDistributionData,
  conflictTrendsData,
  teacherWorkloadData,
  COLORS
} from './analyticsData';

export function AnalyticsCharts() {
  return (
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
  );
}
