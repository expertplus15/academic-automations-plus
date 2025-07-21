
import React from 'react';
import { MatrixGradeHeader } from './MatrixGradeHeader';
import { StreamlinedGradeEntry } from './StreamlinedGradeEntry';
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
      
      <StreamlinedGradeEntry />
    </div>
  );
}
