
import { useState, useEffect, useMemo } from 'react';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';
import { usePrograms } from '@/hooks/usePrograms';
import { useAcademicLevels } from '@/hooks/useAcademicLevels';
import { useClassGroups } from '@/hooks/useClassGroups';
import { useSubjects } from '@/hooks/useSubjects';
import { useStudents } from '@/hooks/useStudents';

interface StreamlinedFilters {
  program: string;
  level: string;
  class: string;
  subject: string;
  evaluationType: string;
  search: string;
}

export function useStreamlinedGradeEntry() {
  const { selectedAcademicYear } = useAcademicYearContext();
  const [filters, setFilters] = useState<StreamlinedFilters>({
    program: '',
    level: '',
    class: '',
    subject: '',
    evaluationType: '',
    search: ''
  });

  // Reset filters when academic year changes
  useEffect(() => {
    if (selectedAcademicYear) {
      setFilters(prev => ({
        ...prev,
        program: '',
        level: '',
        class: '',
        subject: '',
        evaluationType: ''
      }));
    }
  }, [selectedAcademicYear]);

  // Data hooks with cascade filtering
  const { programs, loading: programsLoading } = usePrograms();
  const { data: levels, loading: levelsLoading } = useAcademicLevels(filters.program || undefined);
  const { groups, loading: groupsLoading } = useClassGroups(
    filters.program || undefined, 
    selectedAcademicYear?.id
  );
  const { subjects, loading: subjectsLoading } = useSubjects(
    filters.program || undefined,
    filters.level || undefined
  );

  // Students data
  const selectedLevel = levels.find(level => level.id === filters.level);
  const studentFilters = useMemo(() => ({
    academicYearId: selectedAcademicYear?.id,
    programId: filters.program || undefined,
    // Temporairement désactivé pour debug: yearLevel: selectedLevel?.order_index || undefined,
    groupId: filters.class || undefined,
    search: filters.search || undefined
  }), [selectedAcademicYear?.id, filters, selectedLevel]);

  const { students, loading: studentsLoading } = useStudents(studentFilters);

  // Update filter function
  const updateFilter = (key: keyof StreamlinedFilters, value: string) => {
    setFilters(prev => {
      const actualValue = value === 'all' ? '' : value;
      const newFilters = { ...prev, [key]: actualValue };
      
      // Reset dependent filters when parent changes
      if (key === 'program') {
        newFilters.level = '';
        newFilters.class = '';
        newFilters.subject = '';
        newFilters.evaluationType = '';
      } else if (key === 'level') {
        newFilters.class = '';
        newFilters.subject = '';
        newFilters.evaluationType = '';
      } else if (key === 'subject') {
        newFilters.evaluationType = '';
      }
      
      return newFilters;
    });
  };

  // Evaluation types
  const evaluationTypes = [
    { id: 'cc', name: 'Contrôle Continu', weight: 40 },
    { id: 'td', name: 'Travaux Dirigés', weight: 30 },
    { id: 'exam', name: 'Examen Final', weight: 30 }
  ];

  // Progress tracking
  const currentStep = useMemo(() => {
    if (!filters.program) return 1; // Select program
    if (!filters.subject) return 2; // Select subject
    if (!filters.evaluationType) return 3; // Select evaluation type
    return 4; // Ready for grading
  }, [filters.program, filters.subject, filters.evaluationType]);

  const canStartGrading = filters.program && filters.subject && filters.evaluationType;
  const isLoading = programsLoading || levelsLoading || groupsLoading || subjectsLoading || studentsLoading;

  return {
    filters,
    updateFilter,
    programs,
    levels,
    groups,
    subjects,
    evaluationTypes,
    students,
    isLoading,
    canStartGrading,
    currentStep,
    selectedAcademicYear
  };
}
