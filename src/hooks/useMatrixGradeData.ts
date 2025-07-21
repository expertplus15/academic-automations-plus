import { useMemo } from 'react';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';
import { useMatrixFilters } from '@/hooks/useMatrixFilters';
import { useStudents } from '@/hooks/useStudents';
import { useDUTGEData } from '@/hooks/useDUTGEData';

export function useMatrixGradeData() {
  const { selectedAcademicYear } = useAcademicYearContext();
  const { filters } = useMatrixFilters();
  
  // Transform filters for useStudents hook
  const studentFilters = useMemo(() => ({
    academicYearId: selectedAcademicYear?.id,
    programId: filters.program && filters.program !== 'all' ? filters.program : undefined,
    yearLevel: filters.level && filters.level !== 'all' ? parseInt(filters.level) : undefined,
    groupId: filters.class && filters.class !== 'all' ? filters.class : undefined,
    search: filters.search || undefined
  }), [selectedAcademicYear?.id, filters]);
  
  const { students, loading: studentsLoading } = useStudents(studentFilters);
  const { stats: dutgeStats, loading: dutgeLoading } = useDUTGEData(selectedAcademicYear?.id);

  const isLoading = studentsLoading || dutgeLoading;
  
  // Generate student count description
  const studentCountText = useMemo(() => {
    const count = students.length;
    const isFiltered = filters.program || filters.level || filters.class;
    const studentText = count > 1 ? 'étudiants' : 'étudiant';
    const filteredText = count > 1 ? 'filtrés' : 'filtré';
    const statusText = isFiltered ? filteredText : 'disponibles';
    
    return `${count} ${studentText} ${statusText}`;
  }, [students.length, filters]);

  return {
    selectedAcademicYear,
    students,
    dutgeStats,
    isLoading,
    studentCountText,
    filters
  };
}