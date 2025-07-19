
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Save, Calculator, Users, Clock, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMatrixGrades } from '@/hooks/useMatrixGrades';
import { useSubjects } from '@/hooks/useSubjects';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function MatrixGradeEntry() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [validationResults, setValidationResults] = useState<{ errors: string[]; warnings: string[] }>({ errors: [], warnings: [] });

  const { subjects } = useSubjects();
  const { academicYears } = useAcademicYears();
  const currentAcademicYear = academicYears.find(ay => ay.is_current);
  
  const {
    students,
    evaluationTypes,
    loading,
    saving,
    loadMatrixData,
    updateGrade,
    saveGrades,
    validateGrades
  } = useMatrixGrades();

  // Initialize with current academic year
  useEffect(() => {
    if (currentAcademicYear && !selectedAcademicYear) {
      setSelectedAcademicYear(currentAcademicYear.id);
    }
  }, [currentAcademicYear, selectedAcademicYear]);

  // Load data when selection changes
  useEffect(() => {
    if (selectedSubject && selectedAcademicYear) {
      loadMatrixData(selectedSubject, selectedSemester, selectedAcademicYear);
    }
  }, [selectedSubject, selectedSemester, selectedAcademicYear, loadMatrixData]);

  const handleGradeChange = (studentId: string, evaluationTypeCode: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    updateGrade(studentId, evaluationTypeCode, numValue);
  };

  const handleSave = async () => {
    if (!selectedSubject || !selectedAcademicYear) return;
    
    const validation = validateGrades();
    setValidationResults(validation);
    
    if (validation.errors.length === 0) {
      await saveGrades(selectedSubject, selectedSemester, selectedAcademicYear);
    }
  };

  const getGradeInputColor = (grade: number | null, maxGrade: number) => {
    if (grade === null) return '';
    if (grade < maxGrade * 0.5) return 'border-red-300 bg-red-50';
    if (grade < maxGrade * 0.7) return 'border-yellow-300 bg-yellow-50';
    return 'border-green-300 bg-green-50';
  };

  const calculateStats = () => {
    const totalStudents = students.length;
    const studentsWithGrades = students.filter(s => Object.values(s.grades).some(g => g !== null)).length;
    const completionRate = totalStudents > 0 ? Math.round((studentsWithGrades / totalStudents) * 100) : 0;
    
    return { totalStudents, studentsWithGrades, completionRate };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Interface Matricielle de Saisie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Année académique</label>
              <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'année" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.name} {year.is_current && <Badge variant="default" className="ml-2">Actuelle</Badge>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Matière</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la matière" />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
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
          </div>

          {/* Stats */}
          {selectedSubject && (
            <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{stats.totalStudents} étudiants</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">{stats.studentsWithGrades} avec notes</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-sm">{stats.completionRate}% complété</span>
              </div>
              <div className="ml-auto">
                <Button 
                  onClick={handleSave} 
                  disabled={loading || saving || !selectedSubject}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Alerts */}
      {(validationResults.errors.length > 0 || validationResults.warnings.length > 0) && (
        <div className="space-y-2">
          {validationResults.errors.map((error, index) => (
            <Alert key={`error-${index}`} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
          {validationResults.warnings.map((warning, index) => (
            <Alert key={`warning-${index}`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Matrix Grid */}
      {selectedSubject && students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Grille de Saisie - {subjects.find(s => s.id === selectedSubject)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48 sticky left-0 bg-background">Étudiant</TableHead>
                    {evaluationTypes.map(evalType => (
                      <TableHead key={evalType.id} className="text-center min-w-[120px]">
                        <div className="space-y-1">
                          <div className="font-semibold">{evalType.name}</div>
                          <div className="text-xs text-muted-foreground">
                            /{evalType.max_grade} • {evalType.weight_percentage}%
                          </div>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center min-w-[100px]">Moyenne</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium sticky left-0 bg-background">
                        <div>
                          <div className="font-semibold">{student.full_name}</div>
                          <div className="text-xs text-muted-foreground">{student.student_number}</div>
                        </div>
                      </TableCell>
                      {evaluationTypes.map(evalType => (
                        <TableCell key={evalType.id} className="text-center">
                          <Input
                            type="number"
                            min="0"
                            max={evalType.max_grade}
                            step="0.25"
                            value={student.grades[evalType.code] ?? ''}
                            onChange={(e) => handleGradeChange(student.id, evalType.code, e.target.value)}
                            className={`w-20 text-center ${getGradeInputColor(student.grades[evalType.code], evalType.max_grade)}`}
                            placeholder="--"
                          />
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        <Badge variant={student.average ? (student.average >= 10 ? 'default' : 'destructive') : 'secondary'}>
                          {student.average?.toFixed(2) || '--'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {selectedSubject && !loading && students.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun étudiant trouvé</h3>
              <p className="text-muted-foreground">
                Aucun étudiant actif trouvé pour cette configuration.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Chargement...</h3>
              <p className="text-muted-foreground">
                Récupération des données étudiants et notes...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
