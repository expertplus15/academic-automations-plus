
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatrixFilters } from './grade-entry/MatrixFilters';
import { MatrixTable } from './grade-entry/MatrixTable';
import { MatrixStats } from './grade-entry/MatrixStats';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';
import { useMatrixFilters } from '@/hooks/useMatrixFilters';
import { useStudents } from '@/hooks/useStudents';
import { useDUTGEData } from '@/hooks/useDUTGEData';

export function OptimizedMatrixGradeEntry() {
  const { selectedAcademicYear } = useAcademicYearContext();
  const { filters } = useMatrixFilters();
  
  // Construire les filtres pour useStudents
  const studentFilters = {
    academicYearId: selectedAcademicYear?.id,
    programId: filters.program || undefined,
    levelId: filters.level || undefined,
    groupId: filters.class || undefined,
    search: filters.search || undefined
  };
  
  // Utiliser les hooks avec les filtres appropriés
  const { students, loading: studentsLoading } = useStudents(studentFilters);
  const { stats: dutgeStats, loading: dutgeLoading } = useDUTGEData(selectedAcademicYear?.id);

  console.log('🔍 [OPTIMIZED_MATRIX] Current academic year:', selectedAcademicYear?.name);
  console.log('📊 [OPTIMIZED_MATRIX] Students count:', students.length);
  console.log('🎯 [OPTIMIZED_MATRIX] Active filters:', filters);
  console.log('🔍 [OPTIMIZED_MATRIX] Student filters applied:', studentFilters);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête avec informations contextuelles */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center justify-between">
            <div>
              Interface Matricielle - Saisie des Notes
              {selectedAcademicYear && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({selectedAcademicYear.name})
                </span>
              )}
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              {students.length} étudiant{students.length > 1 ? 's' : ''} {filters.program || filters.level || filters.class ? 'filtré' : 'disponible'}{students.length > 1 ? 's' : ''}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <MatrixStats 
            studentsCount={students.length}
            isLoading={studentsLoading || dutgeLoading}
            dutgeStats={dutgeStats}
          />
        </CardContent>
      </Card>

      {/* Filtres de sélection */}
      <MatrixFilters />

      {/* Tableau matriciel */}
      <MatrixTable 
        students={students}
        academicYearId={selectedAcademicYear?.id}
        isLoading={studentsLoading}
        selectedSubjectId={filters.subject || undefined}
      />
    </div>
  );
}
