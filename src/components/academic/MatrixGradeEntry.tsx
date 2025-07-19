import React, { useState, useEffect } from 'react';
import { useSubjects } from '@/hooks/useSubjects';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Save, Calculator } from 'lucide-react';

interface StudentGrade {
  student_id: string;
  student_name: string;
  grades: {
    [key: string]: number | null;
  };
}

export const MatrixGradeEntry = () => {
  const { subjects } = useSubjects();
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [gradeMatrix, setGradeMatrix] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(false);

  const gradeTypes = [
    { key: 'cc1', label: 'CC1', max: 20 },
    { key: 'cc2', label: 'CC2', max: 20 },
    { key: 'td', label: 'TD', max: 20 },
    { key: 'examen', label: 'Examen', max: 20 },
  ];

  useEffect(() => {
    if (selectedSubject) {
      loadGrades();
    }
  }, [selectedSubject]);

  const loadGrades = async () => {
    if (!selectedSubject) return;
    
    setLoading(true);
    try {
      // Load existing grades for this subject
      const { data: existingGrades } = await supabase
        .from('student_grades')
        .select('*')
        .eq('subject_id', selectedSubject);

      // Create grade matrix  
      const matrix: StudentGrade[] = []; // TODO: Get students from proper hook
      // TODO: Process student grades once we have student data

      setGradeMatrix(matrix);
    } catch (error) {
      console.error('Error loading grades:', error);
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const updateGrade = (studentId: string, gradeType: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    setGradeMatrix(prev => 
      prev.map(student => 
        student.student_id === studentId
          ? {
              ...student,
              grades: {
                ...student.grades,
                [gradeType]: numValue,
              },
            }
          : student
      )
    );
  };

  const calculateAverage = (grades: { [key: string]: number | null }) => {
    const validGrades = Object.values(grades).filter(g => g !== null) as number[];
    if (validGrades.length === 0) return null;
    
    const sum = validGrades.reduce((acc, grade) => acc + grade, 0);
    return (sum / validGrades.length).toFixed(2);
  };

  const saveGrades = async () => {
    if (!selectedSubject) return;
    
    setLoading(true);
    try {
      // Delete existing grades for this subject
      await supabase
        .from('student_grades')
        .delete()
        .eq('subject_id', selectedSubject);

      // Insert new grades
      const gradesToInsert = [];
      
      for (const student of gradeMatrix) {
        for (const gradeType of gradeTypes) {
          const grade = student.grades[gradeType.key];
          if (grade !== null) {
            gradesToInsert.push({
              student_id: student.student_id,
              subject_id: selectedSubject,
              grade,
              max_grade: gradeType.max,
              evaluation_type_id: gradeType.key,
              semester: 1,
              is_published: false,
            });
          }
        }
      }

      if (gradesToInsert.length > 0) {
        const { error } = await supabase
          .from('student_grades')
          .insert(gradesToInsert);

        if (error) throw error;
      }

      toast.success('Notes sauvegardées avec succès');
    } catch (error) {
      console.error('Error saving grades:', error);
      toast.error('Erreur lors de la sauvegarde des notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Saisie Matricielle des Notes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Matière</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSubject && (
            <div className="flex justify-between items-center">
              <Badge variant="outline">
                {gradeMatrix.length} étudiants
              </Badge>
              <Button 
                onClick={saveGrades} 
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSubject && gradeMatrix.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Grille de Saisie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Étudiant</TableHead>
                    {gradeTypes.map(type => (
                      <TableHead key={type.key} className="text-center">
                        {type.label}
                        <br />
                        <span className="text-xs text-muted-foreground">/{type.max}</span>
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Moyenne</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradeMatrix.map((student) => (
                    <TableRow key={student.student_id}>
                      <TableCell className="font-medium">
                        {student.student_name}
                      </TableCell>
                      {gradeTypes.map(type => (
                        <TableCell key={type.key} className="text-center">
                          <Input
                            type="number"
                            min="0"
                            max={type.max}
                            step="0.25"
                            value={student.grades[type.key] ?? ''}
                            onChange={(e) => updateGrade(student.student_id, type.key, e.target.value)}
                            className="w-20 text-center"
                            placeholder="--"
                          />
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-medium">
                        {calculateAverage(student.grades) || '--'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};