
import { useState, useEffect, useMemo } from 'react';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';

interface FilterState {
  level: string;
  program: string;
  class: string;
  search: string;
}

export function useMatrixFilters() {
  const { selectedAcademicYear } = useAcademicYearContext();
  const [filters, setFilters] = useState<FilterState>({
    level: '',
    program: '',
    class: '',
    search: ''
  });

  // Reset filters when academic year changes
  useEffect(() => {
    if (selectedAcademicYear) {
      setFilters(prev => ({
        ...prev,
        program: '',
        level: '',
        class: ''
      }));
    }
  }, [selectedAcademicYear]);

  // Save filters to localStorage
  useEffect(() => {
    const filtersKey = `matrix-filters-${selectedAcademicYear?.id}`;
    localStorage.setItem(filtersKey, JSON.stringify(filters));
  }, [filters, selectedAcademicYear]);

  // Load filters from localStorage
  useEffect(() => {
    if (selectedAcademicYear) {
      const filtersKey = `matrix-filters-${selectedAcademicYear.id}`;
      const savedFilters = localStorage.getItem(filtersKey);
      if (savedFilters) {
        try {
          const parsedFilters = JSON.parse(savedFilters);
          setFilters(prev => ({ ...prev, ...parsedFilters }));
        } catch (error) {
          console.error('Error parsing saved filters:', error);
        }
      }
    }
  }, [selectedAcademicYear]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      // Convert "all" to empty string for consistent handling
      const actualValue = value === 'all' ? '' : value;
      const newFilters = { ...prev, [key]: actualValue };
      
      // Reset dependent filters when parent changes
      if (key === 'program') {
        newFilters.level = '';
        newFilters.class = '';
      } else if (key === 'level') {
        newFilters.class = '';
      }
      
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      program: '',
      level: '',
      class: '',
      search: ''
    });
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '');
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters
  };
}
