import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Save, Calculator } from 'lucide-react';
import { Student } from '@/hooks/useStudents';
import { useStudentGrades, StudentGrade } from '@/hooks/useStudentGrades';
import { useMatrixFilters } from '@/hooks/useMatrixFilters';
import { useEvaluationTypes } from '@/hooks/useEvaluationTypes';
import { useToast } from '@/hooks/use-toast';

interface MatrixTableProps {
  students: Student[];
  academicYearId?: string;
  isLoading: boolean;
}

interface GradeEntry {
  student_id: string;
  cc?: number;
  examen?: number;
  moyenne?: number;
}

export function MatrixTable({ students, academicYearId, isLoading }: MatrixTableProps) {
  const { filters } = useMatrixFilters();
  const { saveGradesBatch, loading: savingGrades } = useStudentGrades();
  const { getEvaluationTypeByCode } = useEvaluationTypes();
  const { toast } = useToast();
  
  const [grades, setGrades] = useState<Record<string, GradeEntry>>({});
  const [semester, setSemester] = useState(1);
  
  // Initialize grades for students
  useEffect(() => {
    const initialGrades: Record<string, GradeEntry> = {};
    students.forEach(student => {
      initialGrades[student.id] = {
        student_id: student.id,
        cc: undefined,
        examen: undefined,
        moyenne: undefined
      };
    });
    setGrades(initialGrades);
  }, [students]);
  
  // Calculate average when CC and Examen are both filled
  const calculateAverage = (cc?: number, examen?: number) => {
    if (cc !== undefined && examen !== undefined) {
      return Math.round(((cc + examen * 2) / 3) * 100) / 100;
    }
    return undefined;
  };
  
  const updateGrade = (studentId: string, field: 'cc' | 'examen', value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    if (numValue !== undefined && (numValue < 0 || numValue > 20)) {
      toast({
        title: "Note invalide",
        description: "La note doit être entre 0 et 20",
        variant: "destructive",
      });
      return;
    }
    
    setGrades(prev => {
      const updated = { ...prev };
      updated[studentId] = { ...updated[studentId], [field]: numValue };
      
      // Auto-calculate average
      const cc = field === 'cc' ? numValue : updated[studentId].cc;
      const examen = field === 'examen' ? numValue : updated[studentId].examen;
      updated[studentId].moyenne = calculateAverage(cc, examen);
      
      return updated;
    });
  };
  
  const saveAllGrades = async () => {
    if (!filters.subject || !academicYearId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une matière avant de sauvegarder",
        variant: "destructive",
      });
      return;
    }
    
    const gradesToSave: StudentGrade[] = [];
    
    // Get evaluation types
    const ccEvalType = getEvaluationTypeByCode('CC');
    const examenEvalType = getEvaluationTypeByCode('EF');
    
    if (!ccEvalType || !examenEvalType) {
      toast({
        title: "Erreur",
        description: "Types d'évaluation non trouvés (CC ou EF)",
        variant: "destructive",
      });
      return;
    }
    
    Object.values(grades).forEach(grade => {
      const currentDate = new Date().toISOString().split('T')[0];
      
      if (grade.cc !== undefined) {
        gradesToSave.push({
          student_id: grade.student_id,
          subject_id: filters.subject,
          evaluation_type_id: ccEvalType.id,
          grade: grade.cc,
          max_grade: 20,
          semester,
          academic_year_id: academicYearId,
          evaluation_date: currentDate,
          is_published: false
        });
      }
      
      if (grade.examen !== undefined) {
        gradesToSave.push({
          student_id: grade.student_id,
          subject_id: filters.subject,
          evaluation_type_id: examenEvalType.id,
          grade: grade.examen,
          max_grade: 20,
          semester,
          academic_year_id: academicYearId,
          evaluation_date: currentDate,
          is_published: false
        });
      }
    });
    
    if (gradesToSave.length > 0) {
      await saveGradesBatch(gradesToSave);
    }
  };
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

  if (!filters.subject) {
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
            <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Veuillez sélectionner une matière pour commencer la saisie</p>
            <p className="text-sm mt-2">Utilisez les filtres ci-dessus pour choisir une matière</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Saisie Matricielle - {students.length} étudiant{students.length > 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={semester}
              onChange={(e) => setSemester(parseInt(e.target.value))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value={1}>Semestre 1</option>
              <option value={2}>Semestre 2</option>
            </select>
            <Button 
              onClick={saveAllGrades}
              disabled={savingGrades}
              size="sm"
              className="flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              {savingGrades ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">N° Étudiant</TableHead>
                <TableHead className="min-w-48">Nom Complet</TableHead>
                <TableHead className="w-20 text-center">CC (/20)</TableHead>
                <TableHead className="w-20 text-center">Examen (/20)</TableHead>
                <TableHead className="w-20 text-center">Moyenne</TableHead>
                <TableHead className="w-24 text-center">Mention</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const studentGrade = grades[student.id];
                const moyenne = studentGrade?.moyenne;
                
                let mention = '';
                let mentionColor = '';
                if (moyenne !== undefined) {
                  if (moyenne >= 16) {
                    mention = 'TB';
                    mentionColor = 'bg-green-100 text-green-800';
                  } else if (moyenne >= 14) {
                    mention = 'B';
                    mentionColor = 'bg-blue-100 text-blue-800';
                  } else if (moyenne >= 12) {
                    mention = 'AB';
                    mentionColor = 'bg-yellow-100 text-yellow-800';
                  } else if (moyenne >= 10) {
                    mention = 'P';
                    mentionColor = 'bg-gray-100 text-gray-800';
                  } else {
                    mention = 'I';
                    mentionColor = 'bg-red-100 text-red-800';
                  }
                }
                
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium text-xs">
                      {student.student_number}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.profile.full_name}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        placeholder="CC"
                        value={studentGrade?.cc || ''}
                        onChange={(e) => updateGrade(student.id, 'cc', e.target.value)}
                        className="w-16 h-8 text-center text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        placeholder="Examen"
                        value={studentGrade?.examen || ''}
                        onChange={(e) => updateGrade(student.id, 'examen', e.target.value)}
                        className="w-16 h-8 text-center text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {moyenne !== undefined ? moyenne.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {mention && (
                        <Badge className={`text-xs ${mentionColor}`}>
                          {mention}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {students.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Formule de calcul: Moyenne = (CC + Examen × 2) ÷ 3
            </div>
            <div>
              Mentions: TB ≥ 16, B ≥ 14, AB ≥ 12, P ≥ 10, I &lt; 10
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}