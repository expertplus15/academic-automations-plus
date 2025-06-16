
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export function PerformanceCharts() {
  const performanceData = [
    { month: "Sept", average: 12.5, attendance: 92 },
    { month: "Oct", average: 13.2, attendance: 94 },
    { month: "Nov", average: 12.8, attendance: 89 },
    { month: "Déc", average: 13.5, attendance: 91 },
    { month: "Jan", average: 14.1, attendance: 95 },
    { month: "Fév", average: 13.9, attendance: 93 }
  ];

  const subjectData = [
    { subject: "Mathématiques", average: 13.2 },
    { subject: "Physique", average: 12.8 },
    { subject: "Informatique", average: 14.5 },
    { subject: "Anglais", average: 13.9 },
    { subject: "Histoire", average: 12.3 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Évolution des Performances</CardTitle>
          <CardDescription>
            Moyennes et assiduité sur l'année académique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Moyenne (/20)"
              />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Assiduité (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performances par Matière</CardTitle>
          <CardDescription>
            Moyennes générales par discipline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
