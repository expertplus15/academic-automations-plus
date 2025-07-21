import React from 'react';
import { MatrixGradeHeader } from './MatrixGradeHeader';
import { MatrixFilters } from './MatrixFilters';
import { MatrixTable } from './MatrixTable';
import { useMatrixGradeData } from '@/hooks/useMatrixGradeData';

export function MatrixGradeEntryPage() {
  const { 
    selectedAcademicYear, 
    students, 
    dutgeStats, 
    isLoading, 
    studentCountText 
  } = useMatrixGradeData();

  return (
    <div className="space-y-6 animate-fade-in">
      <MatrixGradeHeader 
        selectedAcademicYear={selectedAcademicYear}
        studentCountText={studentCountText}
        students={students}
        dutgeStats={dutgeStats}
        isLoading={isLoading}
      />
      
      <MatrixFilters />
      
      <MatrixTable 
        students={students}
        academicYearId={selectedAcademicYear?.id}
        isLoading={isLoading}
      />
    </div>
  );
}