
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Calculator, Users, BookOpen } from 'lucide-react';
import { useStudentGrades } from '@/hooks/useStudentGrades';
import { useSubjects } from '@/hooks/useSubjects';
import { useEvaluationTypes } from '@/hooks/useEvaluationTypes';
import { toast } from 'sonner';

interface MatrixTableProps {
  students: any[];
  academicYearId?: string;
  isLoading: boolean;
}

export function MatrixTable({ students, academicYearId, isLoading }: MatrixTableProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [gradesMatrix, setGradesMatrix] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { evaluationTypes, loading: evalTypesLoading } = useEvaluationTypes();
  const { getMatriceGrades, saveGradesBatch } = useStudentGrades();

  console.log('🔍 [MATRIX_TABLE] Rendering with:', {
    studentsCount: students.length,
    academicYearId,
    selectedSubject,
    selectedSemester
  });

  // Charger les notes existantes quand la matière change
  useEffect(() => {
    if (selectedSubject && academicYearId) {
      loadExistingGrades();
    }
  }, [selectedSubject, selectedSemester, academicYearId]);

  const loadExistingGrades = async () => {
    if (!selectedSubject || !academicYearId) return;
    
    try {
      console.log('🔍 [MATRIX_TABLE] Loading grades for subject:', selectedSubject);
      const existingGrades = await getMatriceGrades(selectedSubject, selectedSemester);
      
      // Créer la matrice avec tous les étudiants
      const matrix = students.map(student => {
        const existing = existingGrades.find(g => g.id === student.id);
        return {
          ...student,
          grades: existing?.grades || { cc: null, examen: null, moyenne: null, coefficient: 2 }
        };
      });
      
      setGradesMatrix(matrix);
      console.log('✅ [MATRIX_TABLE] Loaded grades matrix for', matrix.length, 'students');
    } catch (error) {
      console.error('❌ [MATRIX_TABLE] Error loading grades:', error);
      toast.error('Erreur lors du chargement des notes');
    }
  };

  const updateGrade = (studentId: string, gradeType: 'cc' | 'examen', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    setGradesMatrix(prev => 
      prev.map(student => {
        if (student.id === studentId) {
          const updatedGrades = { ...student.grades, [gradeType]: numValue };
          
          // Calcul automatique de la moyenne
          const cc = updatedGrades.cc;
          const examen = updatedGrades.examen;
          
          if (cc !== null && examen !== null) {
            updatedGrades.moyenne = ((cc + examen) / 2).toFixed(2);
          } else {
            updatedGrades.moyenne = null;
          }
          
          return { ...student, grades: updatedGrades };
        }
        return student;
      })
    );
  };

  const saveGrades = async () => {
    if (!selectedSubject || !academicYearId) return;
    
    setSaving(true);
    try {
      const gradesToSave = [];
      
      // Trouver les types d'évaluation
      const ccType = evaluationTypes.find(et => et.code === 'CC');
      const examType = evaluationTypes.find(et => et.code === 'EF');
      
      if (!ccType || !examType) {
        throw new Error('Types d\'évaluation non trouvés');
      }
      
      for (const student of gradesMatrix) {
        if (student.grades.cc !== null) {
          gradesToSave.push({
            student_id: student.id,
            subject_id: selectedSubject,
            evaluation_type_id: ccType.id,
            grade: student.grades.cc,
            max_grade: 20,
            semester: selectedSemester,
            academic_year_id: academicYearId,
            evaluation_date: new Date().toISOString().split('T')[0],
            is_published: false
          });
        }
        
        if (student.grades.examen !== null) {
          gradesToSave.push({
            student_id: student.id,
            subject_id: selectedSubject,
            evaluation_type_id: examType.id,
            grade: student.grades.examen,
            max_grade: 20,
            semester: selectedSemester,
            academic_year_id: academicYearId,
            evaluation_date: new Date().toISOString().split('T')[0],
            is_published: false
          });
        }
      }
      
      if (gradesToSave.length > 0) {
        await saveGradesBatch(gradesToSave);
        toast.success(`${gradesToSave.length} notes sauvegardées avec succès`);
      } else {
        toast.info('Aucune note à sauvegarder');
      }
    } catch (error) {
      console.error('❌ [MATRIX_TABLE] Error saving grades:', error);
      toast.error('Erreur lors de la sauvegarde des notes');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || subjectsLoading || evalTypesLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Chargement des données...</span>
        </CardContent>
      </Card>
    );
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun étudiant trouvé</h3>
          <p className="text-muted-foreground">
            Vérifiez les filtres ou assurez-vous que des étudiants sont inscrits pour cette année académique.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélection de la matière et du semestre */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Configuration de la saisie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Matière</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Semestre</label>
              <Select value={selectedSemester.toString()} onValueChange={(value) => setSelectedSemester(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semestre 1</SelectItem>
                  <SelectItem value="2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={saveGrades}
                disabled={!selectedSubject || saving || gradesMatrix.length === 0}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau matriciel */}
      {selectedSubject && gradesMatrix.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Saisie Matricielle
              </div>
              <Badge variant="outline">
                {gradesMatrix.length} étudiants
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Étudiant</TableHead>
                    <TableHead className="w-32 text-center">Matricule</TableHead>
                    <TableHead className="w-32 text-center">
                      CC
                      <br />
                      <span className="text-xs text-muted-foreground">/20</span>
                    </TableHead>
                    <TableHead className="w-32 text-center">
                      Examen
                      <br />
                      <span className="text-xs text-muted-foreground">/20</span>
                    </TableHead>
                    <TableHead className="w-32 text-center">
                      Moyenne
                      <br />
                      <span className="text-xs text-muted-foreground">/20</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradesMatrix.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.profile.full_name}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {student.student_number}
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          value={student.grades.cc ?? ''}
                          onChange={(e) => updateGrade(student.id, 'cc', e.target.value)}
                          className="w-20 text-center"
                          placeholder="--"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          value={student.grades.examen ?? ''}
                          onChange={(e) => updateGrade(student.id, 'examen', e.target.value)}
                          className="w-20 text-center"
                          placeholder="--"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-medium">
                          {student.grades.moyenne || '--'}
                        </div>
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
}
