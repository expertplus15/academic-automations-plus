import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Calendar, BookOpen, GraduationCap, Users } from 'lucide-react';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { usePrograms } from '@/hooks/usePrograms';
import { useAcademicLevels } from '@/hooks/useAcademicLevels';
import { useSubjects } from '@/hooks/useSubjects';
import { useStudentAcademicEnrollments } from '@/hooks/useStudentAcademicEnrollments';

interface ImprovedGradeEntryHeaderProps {
  selectedAcademicYear: string;
  selectedProgram: string;
  selectedLevel: string;
  selectedSubject: string;
  selectedSemester: number;
  onAcademicYearChange: (value: string) => void;
  onProgramChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onSemesterChange: (value: number) => void;
}

export function ImprovedGradeEntryHeader({
  selectedAcademicYear,
  selectedProgram,
  selectedLevel,
  selectedSubject,
  selectedSemester,
  onAcademicYearChange,
  onProgramChange,
  onLevelChange,
  onSubjectChange,
  onSemesterChange
}: ImprovedGradeEntryHeaderProps) {
  const { academicYears } = useAcademicYears();
  const { programs } = usePrograms();
  const { data: levels } = useAcademicLevels();
  const { subjects } = useSubjects(selectedProgram);
  const { enrollments } = useStudentAcademicEnrollments(selectedAcademicYear, selectedProgram);

  const currentYear = academicYears.find(ay => ay.is_current);
  const selectedYear = academicYears.find(ay => ay.id === selectedAcademicYear);

  // Réinitialiser les sélections dépendantes quand l'année change
  useEffect(() => {
    if (selectedAcademicYear) {
      onProgramChange('');
      onLevelChange('');
      onSubjectChange('');
    }
  }, [selectedAcademicYear]);

  // Réinitialiser matière quand le programme change
  useEffect(() => {
    if (selectedProgram) {
      onSubjectChange('');
    }
  }, [selectedProgram]);

  const getYearStatus = () => {
    if (!selectedYear) return null;
    
    const isCurrentYear = selectedYear.is_current;
    const studentCount = enrollments.length;
    
    return {
      isCurrentYear,
      studentCount,
      message: isCurrentYear 
        ? `Année courante - ${studentCount} étudiants inscrits pour les évaluations`
        : studentCount === 0 
          ? 'Aucun étudiant inscrit pour les évaluations cette année'
          : `${studentCount} étudiants trouvés`
    };
  };

  const yearStatus = getYearStatus();

  return (
    <div className="space-y-6">
      {/* Message informatif */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Correspondance Matricule/Année :</strong> Les étudiants avec matricules 2324xxx 
          (inscrits en 2023-2024) passent leurs examens et évaluations en 2024-2025.
        </AlertDescription>
      </Alert>

      {/* Sélecteurs synchronisés */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Année académique */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Année académique
              </label>
              <Select value={selectedAcademicYear} onValueChange={onAcademicYearChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'année" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      <div className="flex items-center gap-2">
                        {year.name}
                        {year.is_current && <Badge variant="default" className="text-xs">Courante</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Programme */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Programme
              </label>
              <Select 
                value={selectedProgram} 
                onValueChange={onProgramChange}
                disabled={!selectedAcademicYear}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner programme" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name} ({program.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Niveau */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Niveau
              </label>
              <Select 
                value={selectedLevel} 
                onValueChange={onLevelChange}
                disabled={!selectedProgram}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner niveau" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Matière */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Matière
              </label>
              <Select 
                value={selectedSubject} 
                onValueChange={onSubjectChange}
                disabled={!selectedProgram}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner matière" />
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

            {/* Semestre */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
              <Select 
                value={selectedSemester.toString()} 
                onValueChange={(value) => onSemesterChange(parseInt(value))}
                disabled={!selectedSubject}
              >
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

          {/* Statut de l'année sélectionnée */}
          {yearStatus && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Statut :</span>
                <span className="text-sm">{yearStatus.message}</span>
                {yearStatus.isCurrentYear && (
                  <Badge variant="default" className="text-xs">Année d'évaluation</Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}