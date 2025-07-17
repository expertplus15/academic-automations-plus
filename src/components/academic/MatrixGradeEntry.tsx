import React, { useState, useEffect } from 'react';
import { Save, Calculator, Eye, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  student_number: string;
  profile: {
    full_name: string;
  };
}

interface Subject {
  id: string;
  code: string;
  name: string;
  coefficient: number;
}

interface Grade {
  student_id: string;
  subject_id: string;
  cc1?: number;
  cc2?: number;
  td?: number;
  examen?: number;
  average?: number;
}

interface Program {
  id: string;
  name: string;
  code: string;
}

interface Level {
  id: string;
  name: string;
  code: string;
}

export function MatrixGradeEntry() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Map<string, Grade>>(new Map());
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      fetchLevels();
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedLevel) {
      fetchStudentsAndSubjects();
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedSubject && students.length > 0) {
      fetchExistingGrades();
    }
  }, [selectedSubject, students]);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('id, name, code')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchLevels = async () => {
    try {
      const { data, error } = await supabase
        .from('academic_levels')
        .select('id, name, code')
        .order('order_index');

      if (error) throw error;
      setLevels(data || []);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const fetchStudentsAndSubjects = async () => {
    try {
      // Fetch students for the selected level
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          id,
          student_number,
          profile:profiles!inner (
            full_name
          )
        `)
        .eq('level_id', selectedLevel)
        .eq('status', 'active')
        .order('student_number');

      if (studentsError) throw studentsError;

      // Fetch subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('id, code, name, coefficient')
        .eq('is_active', true)
        .order('name');

      if (subjectsError) throw subjectsError;

      setStudents(studentsData || []);
      setSubjects(subjectsData || []);
    } catch (error) {
      console.error('Error fetching students and subjects:', error);
    }
  };

  const fetchExistingGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('student_grades')
        .select('student_id, grade, grade_type')
        .eq('subject_id', selectedSubject)
        .in('student_id', students.map(s => s.id));

      if (error) throw error;

      const gradesMap = new Map<string, Grade>();
      
      // Group grades by student
      data?.forEach(grade => {
        const key = `${grade.student_id}-${selectedSubject}`;
        const existing = gradesMap.get(key) || {
          student_id: grade.student_id,
          subject_id: selectedSubject
        };

        switch (grade.grade_type) {
          case 'CC1':
            existing.cc1 = grade.grade;
            break;
          case 'CC2':
            existing.cc2 = grade.grade;
            break;
          case 'TD':
            existing.td = grade.grade;
            break;
          case 'Examen':
            existing.examen = grade.grade;
            break;
        }

        gradesMap.set(key, existing);
      });

      setGrades(gradesMap);
    } catch (error) {
      console.error('Error fetching existing grades:', error);
    }
  };

  const updateGrade = (studentId: string, type: keyof Grade, value: string) => {
    const key = `${studentId}-${selectedSubject}`;
    const existing = grades.get(key) || {
      student_id: studentId,
      subject_id: selectedSubject
    };

    const numValue = value === '' ? undefined : parseFloat(value);
    
    if (numValue !== undefined && (numValue < 0 || numValue > 20)) {
      toast({
        title: "Erreur",
        description: "La note doit être entre 0 et 20",
        variant: "destructive"
      });
      return;
    }

    const updated = { ...existing, [type]: numValue };
    const newGrades = new Map(grades);
    newGrades.set(key, updated);
    setGrades(newGrades);
  };

  const calculateAverages = () => {
    setCalculating(true);
    
    const newGrades = new Map(grades);
    
    newGrades.forEach((grade, key) => {
      const { cc1, cc2, td, examen } = grade;
      let average = 0;
      let count = 0;
      
      // Simple average calculation - can be customized
      if (cc1 !== undefined) { average += cc1; count++; }
      if (cc2 !== undefined) { average += cc2; count++; }
      if (td !== undefined) { average += td; count++; }
      if (examen !== undefined) { average += examen * 2; count += 2; } // Examen worth double
      
      if (count > 0) {
        grade.average = Math.round((average / count) * 100) / 100;
      }
    });
    
    setGrades(newGrades);
    setCalculating(false);
    
    toast({
      title: "Succès",
      description: "Moyennes calculées automatiquement"
    });
  };

  const saveGrades = async () => {
    if (!selectedSubject) return;

    setSaving(true);
    
    try {
      const gradeEntries: any[] = [];
      
      grades.forEach(grade => {
        if (grade.cc1 !== undefined) {
          gradeEntries.push({
            student_id: grade.student_id,
            subject_id: grade.subject_id,
            grade: grade.cc1,
            max_grade: 20,
            grade_type: 'CC1',
            is_published: true
          });
        }
        if (grade.cc2 !== undefined) {
          gradeEntries.push({
            student_id: grade.student_id,
            subject_id: grade.subject_id,
            grade: grade.cc2,
            max_grade: 20,
            grade_type: 'CC2',
            is_published: true
          });
        }
        if (grade.td !== undefined) {
          gradeEntries.push({
            student_id: grade.student_id,
            subject_id: grade.subject_id,
            grade: grade.td,
            max_grade: 20,
            grade_type: 'TD',
            is_published: true
          });
        }
        if (grade.examen !== undefined) {
          gradeEntries.push({
            student_id: grade.student_id,
            subject_id: grade.subject_id,
            grade: grade.examen,
            max_grade: 20,
            grade_type: 'Examen',
            is_published: true
          });
        }
      });

      // Delete existing grades for this subject and students
      await supabase
        .from('student_grades')
        .delete()
        .eq('subject_id', selectedSubject)
        .in('student_id', students.map(s => s.id));

      // Insert new grades
      if (gradeEntries.length > 0) {
        const { error } = await supabase
          .from('student_grades')
          .insert(gradeEntries);

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: `${gradeEntries.length} notes sauvegardées`
      });

    } catch (error) {
      console.error('Error saving grades:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les notes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getGradeColor = (grade?: number) => {
    if (grade === undefined) return '';
    if (grade >= 16) return 'text-green-600 bg-green-50';
    if (grade >= 14) return 'text-blue-600 bg-blue-50';
    if (grade >= 10) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Saisie Matricielle des Notes</h2>
        <p className="text-muted-foreground">
          Interface de saisie rapide pour tous les étudiants d'une classe
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sélection de la classe et matière</CardTitle>
          <CardDescription>
            Choisissez le programme, niveau et matière pour commencer la saisie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Programme</label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un programme" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(program => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name} ({program.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Niveau</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel} disabled={!selectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name} ({level.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Matière</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedSubject && students.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Grille de saisie - {selectedSubjectData?.name}</CardTitle>
                <CardDescription>
                  {students.length} étudiants • Coefficient: {selectedSubjectData?.coefficient}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={calculateAverages}
                  disabled={calculating}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculer moyennes
                </Button>
                <Button 
                  onClick={saveGrades}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="text-left p-3 font-medium">Étudiant</th>
                    <th className="text-center p-3 font-medium">CC1</th>
                    <th className="text-center p-3 font-medium">CC2</th>
                    <th className="text-center p-3 font-medium">TD</th>
                    <th className="text-center p-3 font-medium">Examen</th>
                    <th className="text-center p-3 font-medium">Moyenne</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => {
                    const key = `${student.id}-${selectedSubject}`;
                    const studentGrade = grades.get(key) || {
                      student_id: student.id,
                      subject_id: selectedSubject
                    };

                    return (
                      <tr key={student.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{student.profile.full_name}</p>
                            <p className="text-sm text-muted-foreground">{student.student_number}</p>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={studentGrade.cc1 ?? ''}
                            onChange={(e) => updateGrade(student.id, 'cc1', e.target.value)}
                            className="w-20 text-center"
                            placeholder="-"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={studentGrade.cc2 ?? ''}
                            onChange={(e) => updateGrade(student.id, 'cc2', e.target.value)}
                            className="w-20 text-center"
                            placeholder="-"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={studentGrade.td ?? ''}
                            onChange={(e) => updateGrade(student.id, 'td', e.target.value)}
                            className="w-20 text-center"
                            placeholder="-"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={studentGrade.examen ?? ''}
                            onChange={(e) => updateGrade(student.id, 'examen', e.target.value)}
                            className="w-20 text-center"
                            placeholder="-"
                          />
                        </td>
                        <td className="p-3 text-center">
                          {studentGrade.average !== undefined ? (
                            <Badge className={getGradeColor(studentGrade.average)}>
                              {studentGrade.average.toFixed(2)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedSubject && (
        <Card>
          <CardContent className="py-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Sélectionnez une configuration</h3>
            <p className="text-muted-foreground">
              Choisissez un programme, niveau et matière pour commencer la saisie des notes
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}