import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAcademicYears, AcademicYear } from '@/hooks/useAcademicYears';

interface AcademicYearContextType {
  selectedAcademicYear: AcademicYear | null;
  setSelectedAcademicYear: (year: AcademicYear) => void;
  academicYears: AcademicYear[];
  loading: boolean;
}

const AcademicYearContext = createContext<AcademicYearContextType | undefined>(undefined);

export function AcademicYearProvider({ children }: { children: React.ReactNode }) {
  const { academicYears, currentYear, loading } = useAcademicYears();
  const [selectedAcademicYear, setSelectedAcademicYearState] = useState<AcademicYear | null>(null);

  // Initialiser avec l'année courante ou une année sauvegardée
  useEffect(() => {
    if (academicYears.length > 0 && !selectedAcademicYear) {
      const savedYearName = localStorage.getItem('selectedAcademicYear');
      const savedYear = savedYearName ? academicYears.find(year => year.name === savedYearName) : null;
      const yearToSelect = savedYear || currentYear || academicYears[0];
      
      if (yearToSelect) {
        setSelectedAcademicYearState(yearToSelect);
      }
    }
  }, [academicYears, currentYear, selectedAcademicYear]);

  const setSelectedAcademicYear = (year: AcademicYear) => {
    setSelectedAcademicYearState(year);
    localStorage.setItem('selectedAcademicYear', year.name);
  };

  return (
    <AcademicYearContext.Provider value={{
      selectedAcademicYear,
      setSelectedAcademicYear,
      academicYears,
      loading
    }}>
      {children}
    </AcademicYearContext.Provider>
  );
}

export function useAcademicYearContext() {
  const context = useContext(AcademicYearContext);
  if (context === undefined) {
    throw new Error('useAcademicYearContext must be used within an AcademicYearProvider');
  }
  return context;
}