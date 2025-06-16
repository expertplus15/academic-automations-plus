
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, TrendingDown } from "lucide-react";
import { useStudentsPerformance } from "@/hooks/useStudentsPerformance";

export function StudentPerformanceTable() {
  const { students, loading, error } = useStudentsPerformance();

  if (loading) return <div className="animate-pulse h-64 bg-muted rounded"></div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  const getPerformanceBadge = (average: number) => {
    if (average >= 16) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (average >= 14) return <Badge className="bg-blue-100 text-blue-800">Bien</Badge>;
    if (average >= 12) return <Badge className="bg-yellow-100 text-yellow-800">Assez Bien</Badge>;
    if (average >= 10) return <Badge className="bg-orange-100 text-orange-800">Passable</Badge>;
    return <Badge variant="destructive">Insuffisant</Badge>;
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performances des Étudiants</CardTitle>
        <CardDescription>
          Vue d'ensemble des résultats académiques
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Étudiant</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Moyenne</TableHead>
              <TableHead>Assiduité</TableHead>
              <TableHead>Tendance</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{student.profiles?.full_name || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">{student.student_number}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{student.programs?.name || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">{student.programs?.code || 'N/A'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {student.averageGrade?.toFixed(2) || '--'}/20
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${
                    (student.attendanceRate || 0) >= 80 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {student.attendanceRate?.toFixed(1) || '--'}%
                  </span>
                </TableCell>
                <TableCell>
                  {getTrendIcon(student.trend || 0)}
                </TableCell>
                <TableCell>
                  {getPerformanceBadge(student.averageGrade || 0)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
