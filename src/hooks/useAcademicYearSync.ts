
import { useEffect } from 'react';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';

interface UseAcademicYearSyncOptions {
  onYearChange?: (year: any) => void;
  autoRefresh?: boolean;
}

export function useAcademicYearSync(options: UseAcademicYearSyncOptions = {}) {
  const { selectedAcademicYear, academicYears, loading } = useAcademicYearContext();

  useEffect(() => {
    if (selectedAcademicYear && options.onYearChange) {
      console.log('🔄 Academic year changed:', selectedAcademicYear.name);
      options.onYearChange(selectedAcademicYear);
    }
  }, [selectedAcademicYear, options.onYearChange]);

  return {
    selectedAcademicYear,
    academicYears,
    loading,
    isYearSelected: !!selectedAcademicYear
  };
}
