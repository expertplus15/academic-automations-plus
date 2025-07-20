import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from 'lucide-react';
import { Student } from '@/hooks/useStudents';

interface MatrixTableProps {
  students: Student[];
  academicYearId?: string;
  isLoading: boolean;
}

export function MatrixTable({ students, academicYearId, isLoading }: MatrixTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Tableau Matriciel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!students.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Tableau Matriciel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun étudiant trouvé pour cette année académique</p>
            <p className="text-sm mt-2">Vérifiez les filtres appliqués</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Tableau Matriciel - {students.length} étudiant{students.length > 1 ? 's' : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Inscription</TableHead>
                <TableHead colSpan={2}>Nom Complet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.student_number}
                  </TableCell>
                  <TableCell colSpan={2}>{student.profile.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.profile.email || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Placeholder for grade entry actions */}
                      <span className="text-xs text-muted-foreground">
                        Actions à implémenter
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}