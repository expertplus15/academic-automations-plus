
import React, { useState, useEffect, useCallback } from 'react';
import { useSubjects } from '@/hooks/useSubjects';
import { useStudents } from '@/hooks/useStudents';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Save, Calculator, Search } from 'lucide-react';
import { debounce } from 'lodash';

interface StudentGrade {
  student_id: string;
  student_name: string;
  student_number: string;
  grades: {
    cc1?: number | null;
    cc2?: number | null;
    td?: number | null;
    examen?: number | null;
  };
}

export const OptimizedMatrixGradeEntry = () => {
  const { subjects } = useSubjects();
  const { students } = useStudents();
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [gradeMatrix, setGradeMatrix] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const gradeTypes = [
    { key: 'cc1', label: 'CC1', max: 20, weight: 0.25 },
    { key: 'cc2', label: 'CC2', max: 20, weight: 0.25 },
    { key: 'td', label: 'TD', max: 20, weight: 0.25 },
    { key: 'examen', label: 'Examen', max: 20, weight: 0.25 },
  ];

  // Debounced auto-save function
  const debouncedSave = useCallback(
    debounce(async (matrix: StudentGrade[]) => {
      if (!autoSaveEnabled || !selectedSubject) return;
      
      try {
        const gradesToSave = [];
        
        for (const student of matrix) {
          for (const gradeType of gradeTypes) {
            const grade = student.grades[gradeType.key as keyof typeof student.grades];
            if (grade !== null && grade !== undefined) {
              gradesToSave.push({
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

        if (gradesToSave.length > 0) {
          // Delete existing grades first
          await supabase
            .from('student_grades')
            .delete()
            .eq('subject_id', selectedSubject);

          // Insert new grades
          const { error } = await supabase
            .from('student_grades')
            .insert(gradesToSave);

          if (error) throw error;
          
          toast.success('Notes sauvegardées automatiquement');
        }
      } catch (error) {
        console.error('Auto-save error:', error);
      }
    }, 2000),
    [selectedSubject, autoSaveEnabled]
  );

  useEffect(() => {
    if (selectedSubject && students.length > 0) {
      loadGrades();
    }
  }, [selectedSubject, students]);

  const loadGrades = async () => {
    if (!selectedSubject) return;
    
    setLoading(true);
    try {
      // Load existing grades for this subject
      const { data: existingGrades } = await supabase
        .from('student_grades')
        .select('*')
        .eq('subject_id', selectedSubject);

      // Create grade matrix with filtered students
      const filteredStudents = students.filter(student => 
        searchTerm === '' || 
        student.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matrix: StudentGrade[] = filteredStudents.map(student => {
        const studentGrades = existingGrades?.filter(g => g.student_id === student.id) || [];
        
        return {
          student_id: student.id,
          student_name: student.profiles?.full_name || 'N/A',
          student_number: student.student_number || 'N/A',
          grades: {
            cc1: studentGrades.find(g => g.evaluation_type_id === 'cc1')?.grade || null,
            cc2: studentGrades.find(g => g.evaluation_type_id === 'cc2')?.grade || null,
            td: studentGrades.find(g => g.evaluation_type_id === 'td')?.grade || null,
            examen: studentGrades.find(g => g.evaluation_type_id === 'examen')?.grade || null,
          },
        };
      });

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
    
    setGradeMatrix(prev => {
      const updated = prev.map(student => 
        student.student_id === studentId
          ? {
              ...student,
              grades: {
                ...student.grades,
                [gradeType]: numValue,
              },
            }
          : student
      );
      
      // Trigger auto-save
      debouncedSave(updated);
      return updated;
    });
  };

  const calculateAverage = (grades: { [key: string]: number | null }) => {
    const validGrades = gradeTypes
      .map(type => ({ value: grades[type.key], weight: type.weight }))
      .filter(g => g.value !== null && g.value !== undefined);
    
    if (validGrades.length === 0) return null;
    
    const weightedSum = validGrades.reduce((acc, grade) => acc + (grade.value! * grade.weight), 0);
    const totalWeight = validGrades.reduce((acc, grade) => acc + grade.weight, 0);
    
    return (weightedSum / totalWeight).toFixed(2);
  };

  const manualSave = async () => {
    debouncedSave.cancel(); // Cancel pending auto-save
    await debouncedSave(gradeMatrix); // Save immediately
  };

  // Filter students based on search term
  const filteredMatrix = gradeMatrix.filter(student =>
    searchTerm === '' ||
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Simplified Header */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Saisie Matricielle Optimisée</span>
            </div>
            <Badge variant={autoSaveEnabled ? "default" : "secondary"}>
              {autoSaveEnabled ? "Auto-save ON" : "Auto-save OFF"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {selectedSubject && (
            <div className="flex justify-between items-center">
              <Badge variant="outline">
                {filteredMatrix.length} étudiants
              </Badge>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                >
                  {autoSaveEnabled ? "Désactiver auto-save" : "Activer auto-save"}
                </Button>
                <Button 
                  onClick={manualSave} 
                  disabled={loading}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optimized Grade Matrix */}
      {selectedSubject && filteredMatrix.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="sticky left-0 bg-muted/50 border-r p-3 text-left font-medium">
                      Étudiant
                    </th>
                    {gradeTypes.map(type => (
                      <th key={type.key} className="text-center p-3 font-medium min-w-[100px]">
                        <div>{type.label}</div>
                        <div className="text-xs text-muted-foreground">/{type.max}</div>
                      </th>
                    ))}
                    <th className="text-center p-3 font-medium min-w-[100px]">Moyenne</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatrix.map((student, index) => (
                    <tr key={student.student_id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="sticky left-0 bg-inherit border-r p-3">
                        <div className="font-medium">{student.student_name}</div>
                        <div className="text-sm text-muted-foreground">{student.student_number}</div>
                      </td>
                      {gradeTypes.map(type => (
                        <td key={type.key} className="text-center p-3">
                          <Input
                            type="number"
                            min="0"
                            max={type.max}
                            step="0.25"
                            value={student.grades[type.key as keyof typeof student.grades] ?? ''}
                            onChange={(e) => updateGrade(student.student_id, type.key, e.target.value)}
                            className="w-20 text-center"
                            placeholder="--"
                          />
                        </td>
                      ))}
                      <td className="text-center p-3">
                        <div className="font-medium text-lg">
                          {calculateAverage(student.grades) || '--'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
