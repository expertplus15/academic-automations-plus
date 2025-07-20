import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Save, RefreshCw, Download, Upload } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { useDUTGEData } from '@/hooks/useDUTGEData';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';
import { MatrixFilters } from './grade-entry/MatrixFilters';
import { toast } from 'sonner';
import _ from 'lodash';

interface GradeEntry {
  student_id: string;
  student_name: string;
  student_number: string;
  grades: {
    cc1: number | null;
    cc2: number | null;
    cc3: number | null;
    exam: number | null;
    rattrapage: number | null;
  };
  average: number | null;
  status: 'pass' | 'fail' | 'pending';
}

export function OptimizedMatrixGradeEntry() {
  const { selectedAcademicYear } = useAcademicYearContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [grades, setGrades] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch students data
  const { students, loading: studentsLoading } = useStudents();
  const dutgeData = useDUTGEData();

  // Filter students based on selected filters
  const filteredStudents = useMemo(() => {
    if (!students) return [];

    return students.filter(student => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        student.profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_number?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by program - using the program relationship
      const matchesProgram = selectedProgram === '' || student.program.id === selectedProgram;

      // Note: useStudents doesn't provide academic_year_id, so skip this filter for now
      const matchesAcademicYear = true;

      return matchesSearch && matchesProgram && matchesAcademicYear;
    });
  }, [students, searchTerm, selectedProgram, selectedAcademicYear]);

  // Create grade matrix
  const gradeMatrix = useMemo(() => {
    return filteredStudents.map(student => {
      const studentGrades = grades[student.id] || {};
      
      return {
        student_id: student.id,
        student_name: student.profile.full_name || 'N/A',
        student_number: student.student_number || 'N/A',
        grades: {
          cc1: studentGrades.cc1 || null,
          cc2: studentGrades.cc2 || null,
          cc3: studentGrades.cc3 || null,
          exam: studentGrades.exam || null,
          rattrapage: studentGrades.rattrapage || null,
        },
        average: calculateAverage(studentGrades),
        status: getStatus(calculateAverage(studentGrades))
      } as GradeEntry;
    });
  }, [filteredStudents, grades]);

  const calculateAverage = (studentGrades: Record<string, number>) => {
    const validGrades = Object.values(studentGrades).filter(grade => grade !== null && grade !== undefined);
    if (validGrades.length === 0) return null;
    return validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
  };

  const getStatus = (average: number | null): 'pass' | 'fail' | 'pending' => {
    if (average === null) return 'pending';
    return average >= 10 ? 'pass' : 'fail';
  };

  const handleGradeChange = (studentId: string, gradeType: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    if (numValue !== null && (numValue < 0 || numValue > 20)) {
      toast.error('La note doit être entre 0 et 20');
      return;
    }

    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [gradeType]: numValue
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notes sauvegardées avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Export functionality
    toast.info('Export en cours...');
  };

  const handleImport = () => {
    // Import functionality
    toast.info('Import en cours...');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      pass: 'Admis',
      fail: 'Échec',
      pending: 'En attente'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  if (studentsLoading || dutgeData.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Chargement des données...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <MatrixFilters
        selectedLevel={selectedLevel}
        selectedProgram={selectedProgram}
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        onLevelChange={setSelectedLevel}
        onProgramChange={setSelectedProgram}
        onClassChange={setSelectedClass}
        onSubjectChange={setSelectedSubject}
      />

      {/* Barre de recherche et actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="outline">
            {gradeMatrix.length} étudiants
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Matrice des notes */}
      <Card>
        <CardHeader>
          <CardTitle>Matrice de saisie des notes</CardTitle>
        </CardHeader>
        <CardContent>
          {gradeMatrix.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun étudiant trouvé avec les filtres sélectionnés.</p>
              <p className="text-sm mt-2">Veuillez ajuster vos critères de recherche.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 min-w-[200px]">Étudiant</th>
                    <th className="text-left p-2 min-w-[120px]">Numéro</th>
                    <th className="text-center p-2 min-w-[80px]">CC1</th>
                    <th className="text-center p-2 min-w-[80px]">CC2</th>
                    <th className="text-center p-2 min-w-[80px]">CC3</th>
                    <th className="text-center p-2 min-w-[80px]">Examen</th>
                    <th className="text-center p-2 min-w-[80px]">Rattrapage</th>
                    <th className="text-center p-2 min-w-[80px]">Moyenne</th>
                    <th className="text-center p-2 min-w-[100px]">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeMatrix.map((entry) => (
                    <tr key={entry.student_id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{entry.student_name}</td>
                      <td className="p-2 text-muted-foreground">{entry.student_number}</td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          value={entry.grades.cc1 || ''}
                          onChange={(e) => handleGradeChange(entry.student_id, 'cc1', e.target.value)}
                          className="w-16 text-center"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          value={entry.grades.cc2 || ''}
                          onChange={(e) => handleGradeChange(entry.student_id, 'cc2', e.target.value)}
                          className="w-16 text-center"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          value={entry.grades.cc3 || ''}
                          onChange={(e) => handleGradeChange(entry.student_id, 'cc3', e.target.value)}
                          className="w-16 text-center"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          value={entry.grades.exam || ''}
                          onChange={(e) => handleGradeChange(entry.student_id, 'exam', e.target.value)}
                          className="w-16 text-center"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          value={entry.grades.rattrapage || ''}
                          onChange={(e) => handleGradeChange(entry.student_id, 'rattrapage', e.target.value)}
                          className="w-16 text-center"
                        />
                      </td>
                      <td className="p-2 text-center font-medium">
                        {entry.average ? entry.average.toFixed(2) : '-'}
                      </td>
                      <td className="p-2 text-center">
                        {getStatusBadge(entry.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}