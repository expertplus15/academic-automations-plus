
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Tables = {
  profiles: any;
  students: any;
  programs: any;
  subjects: any;
  departments: any;
  academic_levels: any;
  class_groups: any;
  specializations: any;
  rooms: any;
  campuses: any;
  sites: any;
  academic_alerts: any;
  document_templates: any;
  document_requests: any;
  generated_documents: any;
  alert_configurations: any;
};

export function useTable<T extends keyof Tables>(
  tableName: T,
  select = '*',
  filters?: any
) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase.from(tableName).select(select);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key as any, value);
        });
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setData(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName, select, JSON.stringify(filters)]);

  return { data, loading, error, refetch: fetchData };
}

// Hook spécialisé pour les étudiants
export function useStudents() {
  return useTable('students', `
    *,
    profiles!students_profile_id_fkey(*),
    programs!students_program_id_fkey(*)
  `);
}

// Hook spécialisé pour les programmes
export function usePrograms() {
  return useTable('programs', `
    *,
    departments!programs_department_id_fkey(*)
  `);
}

// Hook spécialisé pour les départements
export function useDepartments() {
  return useTable('departments');
}

// Hook spécialisé pour les matières
export function useSubjects() {
  return useTable('subjects');
}

// Hook spécialisé pour les filières/spécialisations
export function useSpecializations() {
  return useTable('specializations', `
    *,
    programs!specializations_program_id_fkey(*)
  `);
}

// Hook spécialisé pour les niveaux d'études
export function useAcademicLevels() {
  return useTable('academic_levels');
}

// Re-export des fonctions utilitaires pour l'inscription
export { autoEnrollStudent, generateStudentNumber } from '@/services/studentEnrollmentService';
export type { StudentEnrollmentData, EnrollmentResult } from '@/services/studentEnrollmentService';
