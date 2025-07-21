
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatrixFilters } from './grade-entry/MatrixFilters';
import { MatrixTable } from './grade-entry/MatrixTable';
import { MatrixStats } from './grade-entry/MatrixStats';
import { StudentSyncStatus } from './grade-entry/StudentSyncStatus';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';
import { useMatrixFilters } from '@/hooks/useMatrixFilters';
import { useStudents } from '@/hooks/useStudents';
import { useDUTGEData } from '@/hooks/useDUTGEData';

export function OptimizedMatrixGradeEntry() {
  const { selectedAcademicYear } = useAcademicYearContext();
  const { filters } = useMatrixFilters();
  
  // Construire les filtres pour useStudents - corriger le filtrage par programme
  const studentFilters = {
    academicYearId: selectedAcademicYear?.id,
    // Convertir "all" et chaînes vides en undefined pour le filtrage correct
    programId: filters.program && filters.program !== 'all' ? filters.program : undefined,
    yearLevel: filters.level && filters.level !== 'all' ? parseInt(filters.level) : undefined,
    groupId: filters.class && filters.class !== 'all' ? filters.class : undefined,
    search: filters.search || undefined
  };
  
  // Utiliser les hooks avec les filtres appropriés
  const { students, loading: studentsLoading } = useStudents(studentFilters);
  const { stats: dutgeStats, loading: dutgeLoading } = useDUTGEData(selectedAcademicYear?.id);

  console.log('🔍 [OPTIMIZED_MATRIX] Current academic year:', selectedAcademicYear?.name);
  console.log('📊 [OPTIMIZED_MATRIX] Students count:', students.length);
  console.log('🎯 [OPTIMIZED_MATRIX] Active filters:', filters);
  console.log('🔍 [OPTIMIZED_MATRIX] Student filters applied:', studentFilters);
  console.log('👥 [OPTIMIZED_MATRIX] Students details:', students.map(s => ({
    id: s.id,
    name: s.profile.full_name,
    student_number: s.student_number,
    program_id: s.program_id,
    current_academic_year_id: s.current_academic_year_id,
    academic_year_id: s.academic_year_id
  })));

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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <MatrixStats 
                studentsCount={students.length}
                isLoading={studentsLoading || dutgeLoading}
                dutgeStats={dutgeStats}
              />
            </div>
            <div className="lg:col-span-1">
              <StudentSyncStatus 
                students={students}
                loading={studentsLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres de sélection */}
      <MatrixFilters />

      {/* Tableau matriciel */}
      <MatrixTable 
        students={students}
        academicYearId={selectedAcademicYear?.id}
        isLoading={studentsLoading}
      />
    </div>
  );
}
